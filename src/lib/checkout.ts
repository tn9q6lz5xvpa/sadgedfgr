"use server";

import { db } from "@/db";
import { orderItemsTable, ordersTable, productsTable } from "@/db/schema";
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
    return {
      error: "Guest email is required if user is not logged in",
    };
  }

  // Validate cart is not empty
  if (!session.cart.items || session.cart.items.length === 0) {
    return {
      error: "Cart is empty. Please add items to your cart before checkout.",
    };
  }

  // Calculate total amount for PayPal
  const totalAmount = session.cart.items
    .reduce((total, item) => {
      const itemCost = getCartItemCost(item);
      const cost = Number(itemCost.cost);
      if (isNaN(cost) || cost <= 0) {
        console.error("Invalid item cost:", {
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          discount: item.product.discount_percent,
          quantity: item.quantity,
          calculatedCost: itemCost,
        });
      }
      return total + cost;
    }, 0)
    .toFixed(2);

  // Validate total amount is greater than zero
  if (Number(totalAmount) <= 0) {
    console.error("Invalid cart total:", {
      totalAmount,
      items: session.cart.items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        discount: item.product.discount_percent,
        quantity: item.quantity,
        cost: getCartItemCost(item),
      })),
    });
    return {
      error: "Cart total must be greater than zero. Please check your cart items.",
    };
  }

  const total_price = session.cart.items.reduce((total, item) => {
    return total + Number(item.product.price) * item.quantity;
  }, 0);

  // Log cart details for debugging
  console.log("Creating PayPal order with:", {
    totalAmount,
    itemCount: session.cart.items.length,
    items: session.cart.items.map((item) => ({
      name: item.product.name,
      price: item.product.price,
      discount: item.product.discount_percent,
      quantity: item.quantity,
      cost: getCartItemCost(item),
    })),
  });

  let paypalApiResponse: ApiResponse<Order>;

  try {
    // Build items array with validation
    const paypalItems = session.cart.items.map((item) => {
      const itemCost = getCartItemCost(item);
      const unitPrice = (Number(itemCost.cost) / item.quantity).toFixed(2);
      
      if (Number(unitPrice) <= 0) {
        throw new Error(
          `Invalid unit price for ${item.product.name}: ${unitPrice}`,
        );
      }

      return {
        name: item.product.name.substring(0, 127), // PayPal max length
        unitAmount: {
          currencyCode: "USD",
          value: unitPrice,
        },
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
              breakdown: {
                itemTotal: {
                  currencyCode: "USD",
                  value: totalAmount,
                },
              },
            },
            items: paypalItems,
          },
        ],
        payer: {
          name: {
            givenName: input.shipping_first_name,
            surname: input.shipping_last_name,
          },
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
                  // parsePhoneNumber from /min doesn't take country code, but phone should already be validated
                  const parsed = parsePhoneNumber(input.shipping_phone_number);
                  return parsed.nationalNumber;
                } catch (error) {
                  // Fallback: use the phone number as-is if parsing fails
                  console.warn(
                    "Failed to parse phone number, using as-is:",
                    error,
                  );
                  // Remove non-digits as fallback
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
        // Log detailed error information
        console.error("PayPal error details:", JSON.stringify(body, null, 2));
        
        // Extract detailed error message
        let errorMessage = body.message || "PayPal API error";
        if (body.details && Array.isArray(body.details) && body.details.length > 0) {
          const detail = body.details[0];
          errorMessage = `${errorMessage}: ${detail.description || detail.issue || ""} (Field: ${detail.field || "unknown"})`;
        }
        
        return {
          error: errorMessage,
        };
      } catch (parseError) {
        return {
          error: `PayPal API error: ${err.body.toString()}`,
        };
      }
    } else if (err.statusCode) {
      return {
        error: `PayPal API error: Received status code ${err.statusCode}`,
      };
    } else {
      return {
        error: `PayPal API error: ${err.message || "Unknown error"}`,
      };
    }
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
        // awaiting payment
        status: "pending",
      })
      .returning();

    // Check which items are products (not books) by querying the products table
    const productIds = session.cart.items.map((item) => item.product.id);
    const existingProducts = await tx
      .select({ id: productsTable.id })
      .from(productsTable)
      .where(inArray(productsTable.id, productIds));

    const existingProductIds = new Set(existingProducts.map((p) => p.id));

    // Only insert items that are actual products (not books)
    const productItems = session.cart.items.filter((item) =>
      existingProductIds.has(item.product.id),
    );

    if (productItems.length > 0) {
      await tx.insert(orderItemsTable).values(
        productItems.map((item) => ({
          order_id: order.id,
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          subtotal: (Number(item.product.price) * item.quantity).toFixed(2),
        })),
      );
    }

    // Note: Books are not stored in order_items due to foreign key constraint
    // If you need to track books in orders, you'll need to create an order_book_items table
    const bookItems = session.cart.items.filter(
      (item) => !existingProductIds.has(item.product.id),
    );
    if (bookItems.length > 0) {
      console.warn(
        `Warning: ${bookItems.length} book(s) in order ${order.id} are not stored in order_items table. Books: ${bookItems.map((item) => item.product.name).join(", ")}`,
      );
    }
  });

  return {
    jsonResponse: JSON.parse(body.toString()),
    httpStatusCode: httpResponse.statusCode,
  };
}

export async function captureOrder(
  orderId: string,
): Promise<CaptureOrderResponse> {
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
    .set({
      status: "processing",
    })
    .where(eq(ordersTable.paypal_id, paypalOrderId))
    .returning();

  return {
    order: updatedOrders[0],
    jsonResponse: JSON.parse(body.toString()),
    httpStatusCode: httpResponse.statusCode,
  };
}
