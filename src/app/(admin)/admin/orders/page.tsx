import { db } from "@/db";
import { ordersTable } from "@/db/schema";
import { desc, ne } from "drizzle-orm";
import { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";

async function getOrders() {
  return db.query.ordersTable.findMany({
    where: ne(ordersTable.status, "pending"),
    orderBy: desc(ordersTable.created_at),
    with: {
      bookOrderItems: {
        with: { book: true },
      },
    },
  });
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-gray-600">{orders.length} total orders</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <p className="p-6 text-gray-500">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Order ID</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Customer</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Items</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Total</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Date</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">#{order.id}</td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium">{order.shipping_first_name} {order.shipping_last_name}</p>
                        <p className="text-sm text-gray-500">{order.guest_email || "Registered user"}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {order.bookOrderItems?.length ?? 0} items
                    </td>
                    <td className="py-4 px-6 font-medium">${order.total_price}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        order.status === "completed" ? "bg-green-100 text-green-800" :
                        order.status === "processing" ? "bg-blue-100 text-blue-800" :
                        order.status === "cancelled" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {format(new Date(order.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="py-4 px-6">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-[var(--wood-brown)] hover:underline text-sm"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Orders - Admin - The Book Haven",
  robots: "noindex",
};