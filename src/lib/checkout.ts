"use server";

import { db } from "@/db";
import { bookOrderItemsTable, ordersTable, booksTable } from "@/db/schema";
import {
  ApiError,
  CaptureOrderResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  FullAppSession,
} from "@/types";
import {
  ApiResponse,
  CheckoutPaymentIntent,
  Client,
  Environment,
  Order,
  OrdersController,
  PhoneType,
} from "@paypal/paypal-server-sdk";
import { eq, inArray } from "drizzle-orm";
import { parsePhoneNumber } from "libphonenumber-js/min";
import { getCartItemCost } from "./utils";

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
  console.error(
    "PayPal credentials are missing. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in your .env file.",
  );
}

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: PAYPAL_CLIENT_ID!,
    oAuthClientSecret: PAYPAL_CLIENT_SECRET!,
  },
  timeout: 0,
  environment: Environment.Sandbox,
});

const ordersController = new OrdersController(client);

export async function createOrder(
  session: FullAppSession,
  input: CreateOrderRequest,
): Promise<CreateOrderResponse | ApiError> {
  const { guest_email, ...shippingInformation } = input;

  if (!session.user && !guest_email) {
    return { error: "Guest email is required if user is not logged in" };
  }

  if (!session.cart.items || session.cart.items.length === 0) {
    return { error: "Cart is empty. Please add items to your cart before checkout." };
  }

  const totalAmount = session.cart.items
    .reduce((total, item) => {
      const itemCost = getCartItemCost(item);
      return total + Number(itemCost.cost);
    }, 0)
    .toFixed(2);

  if (Number(totalAmount) <= 0) {
    return { error: "Cart total must be greater than zero." };
  }

  const total_price = session.cart.items.reduce((total, item) => {
    return total + Number(item.product.price) * item.quantity;
  }, 0);

  let paypalApiResponse: ApiResponse<Order>;

  try {
    const paypalItems = session.cart.items.map((item) => {
      const itemCost = getCartItemCost(item);
      const unitPrice = (Number(itemCost.cost) / item.quantity).toFixed(2);
      return {
        name: item.product.name.substring(0, 127),
        unitAmount: { currencyCode: "USD", value: unitPrice },
        quantity: item.quantity.toString(),
        description: item.product.name.substring(0, 127),
      };
    });

    paypalApiResponse = await ordersController.ordersCreate({
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              currencyCode: "USD",
              value: totalAmount,
              breakdown: { itemTotal: { currencyCode: "USD", value: totalAmount } },
            },
            items: paypalItems,
          },
        ],
        payer: {
          name: { givenName: input.shipping_first_name, surname: input.shipping_last_name },
          emailAddress: session.user?.email || guest_email,
          address: {
            addressLine1: input.shipping_address,
            adminArea2: input.shipping_city,
            countryCode: input.shipping_country_code,
          },
          phone: {
            phoneType: PhoneType.Mobile,
            phoneNumber: {
              nationalNumber: (() => {
                try {
                  const parsed = parsePhoneNumber(input.shipping_phone_number);
                  return parsed.nationalNumber;
                } catch {
                  return input.shipping_phone_number.replace(/\D/g, "");
                }
              })(),
            },
          },
        },
      },
      prefer: "return=minimal",
    });
  } catch (error) {
    console.error("PayPal API error", error);
    const err = error as any;
    if (err.body) {
      try {
        const body = JSON.parse(err.body.toString());
        let errorMessage = body.message || "PayPal API error";
        if (body.details?.[0]) {
          const detail = body.details[0];
          errorMessage = `${errorMessage}: ${detail.description || detail.issue || ""}`;
        }
        return { error: errorMessage };
      } catch {
        return { error: `PayPal API error: ${err.body.toString()}` };
      }
    }
    return { error: `PayPal API error: ${err.message || "Unknown error"}` };
  }

  const { body, ...httpResponse } = paypalApiResponse;
  const paypalOrderId = httpResponse.result.id;
  if (!paypalOrderId) {
    throw new Error("PayPal order ID not found in response");
  }

  await db.transaction(async (tx) => {
    const [order] = await tx
      .insert(ordersTable)
      .values({
        paypal_id: paypalOrderId,
        user_id: session.user?.id,
        ...shippingInformation,
        total_price: total_price.toFixed(2),
        guest_email,
        status: "pending",
      })
      .returning();

    // Get book IDs from cart
    const bookIds = session.cart.items.map((item) => item.product.id);
    
    // Verify which items are books
    const existingBooks = await tx
      .select({ id: booksTable.id })
      .from(booksTable)
      .where(inArray(booksTable.id, bookIds));

    const existingBookIds = new Set(existingBooks.map((b) => b.id));

    // Insert book order items
    const bookItems = session.cart.items.filter((item) =>
      existingBookIds.has(item.product.id)
    );

    if (bookItems.length > 0) {
      await tx.insert(bookOrderItemsTable).values(
        bookItems.map((item) => ({
          order_id: order.id,
          book_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          subtotal: (Number(item.product.price) * item.quantity).toFixed(2),
        }))
      );
    }
  });

  return {
    jsonResponse: JSON.parse(body.toString()),
    httpStatusCode: httpResponse.statusCode,
  };
}

export async function captureOrder(orderId: string): Promise<CaptureOrderResponse> {
  const { body, ...httpResponse } = await ordersController.ordersCapture({
    id: orderId,
    prefer: "return=minimal",
  });

  const paypalOrderId = httpResponse.result.id;
  if (!paypalOrderId) {
    throw new Error("PayPal order ID not found in response");
  }

  const updatedOrders = await db
    .update(ordersTable)
    .set({ status: "processing" })
    .where(eq(ordersTable.paypal_id, paypalOrderId))
    .returning();

  return {
    order: updatedOrders[0],
    jsonResponse: JSON.parse(body.toString()),
    httpStatusCode: httpResponse.statusCode,
  };
}