import { db } from "@/db";
import { ordersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { UpdateOrderStatus } from "./update-status";

type Props = { params: Promise<{ order_id: string }> };

async function getOrder(orderId: number) {
  return db.query.ordersTable.findFirst({
    where: eq(ordersTable.id, orderId),
    with: {
      bookOrderItems: {
        with: { book: true },
      },
    },
  });
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { order_id } = await params;
  const order = await getOrder(parseInt(order_id));

  if (!order) {
    notFound();
  }

  return (
    <div>
      <Link href="/admin/orders" className="text-sm text-gray-600 hover:underline">
        ← Back to Orders
      </Link>
      
      <div className="flex items-center justify-between mt-2 mb-8">
        <h1 className="text-3xl font-bold">Order #{order.id}</h1>
        <span className={`px-3 py-1 rounded text-sm font-medium ${
          order.status === "completed" ? "bg-green-100 text-green-800" :
          order.status === "processing" ? "bg-blue-100 text-blue-800" :
          order.status === "cancelled" ? "bg-red-100 text-red-800" :
          "bg-gray-100 text-gray-800"
        }`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.bookOrderItems?.map((item) => (
              <div key={item.book_id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                {item.book?.cover_url && (
                  <Image
                    src={item.book.cover_url}
                    alt={item.book.title}
                    width={60}
                    height={90}
                    className="w-15 h-22 object-cover rounded shadow"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{item.book?.title || item.book_id}</p>
                  <p className="text-sm text-gray-500">by {item.book?.author}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">${item.subtotal}</p>
              </div>
            ))}
          </div>
          <div className="border-t mt-4 pt-4 flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-xl">${order.total_price}</span>
          </div>
        </div>

        {/* Order Info & Actions */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Customer</h2>
            <p className="font-medium">{order.shipping_first_name} {order.shipping_last_name}</p>
            {order.guest_email && (
              <p className="text-sm text-gray-600">{order.guest_email}</p>
            )}
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
            <p>{order.shipping_address}</p>
            <p>{order.shipping_city}, {order.shipping_country_code}</p>
          </div>

          {/* Order Date */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Order Date</h2>
            <p>{format(new Date(order.created_at), "MMMM d, yyyy 'at' h:mm a")}</p>
          </div>

          {/* Update Status */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Update Status</h2>
            <UpdateOrderStatus orderId={order.id} currentStatus={order.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { order_id } = await params;
  return {
    title: `Order #${order_id} - Admin - The Book Haven`,
    robots: "noindex",
  };
}