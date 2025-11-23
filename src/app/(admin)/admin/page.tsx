import { db } from "@/db";
import { booksTable, bookOrderItemsTable, ordersTable, usersTable, bookReviewsTable, categoriesTable } from "@/db/schema";
import { count, sum, eq, ne, desc } from "drizzle-orm";
import { Metadata } from "next";
import Link from "next/link";
import {
  ShoppingCartIcon,
  BookOpenIcon,
  UsersIcon,
  CurrencyDollarIcon,
  TagIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

async function getStats() {
  const [
    totalOrders,
    totalRevenue,
    totalBooks,
    totalUsers,
    totalCategories,
    totalReviews,
    recentOrders,
  ] = await Promise.all([
    db.select({ count: count() }).from(ordersTable).where(ne(ordersTable.status, "pending")),
    db.select({ total: sum(ordersTable.total_price) }).from(ordersTable).where(ne(ordersTable.status, "pending")),
    db.select({ count: count() }).from(booksTable),
    db.select({ count: count() }).from(usersTable),
    db.select({ count: count() }).from(categoriesTable),
    db.select({ count: count() }).from(bookReviewsTable),
    db.query.ordersTable.findMany({
      where: ne(ordersTable.status, "pending"),
      orderBy: desc(ordersTable.created_at),
      limit: 5,
      with: {
        bookOrderItems: {
          with: { book: true },
        },
      },
    }),
  ]);

  return {
    totalOrders: totalOrders[0]?.count ?? 0,
    totalRevenue: totalRevenue[0]?.total ?? "0",
    totalBooks: totalBooks[0]?.count ?? 0,
    totalUsers: totalUsers[0]?.count ?? 0,
    totalCategories: totalCategories[0]?.count ?? 0,
    totalReviews: totalReviews[0]?.count ?? 0,
    recentOrders,
  };
}

function StatCard({
  title,
  value,
  icon: Icon,
  href,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  href: string;
}) {
  return (
    <Link href={href} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-[var(--wood-brown)]/10 rounded-lg">
          <Icon className="w-6 h-6 text-[var(--wood-brown)]" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCartIcon}
          href="/admin/orders"
        />
        <StatCard
          title="Total Revenue"
          value={`$${Number(stats.totalRevenue).toFixed(2)}`}
          icon={CurrencyDollarIcon}
          href="/admin/orders"
        />
        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          icon={BookOpenIcon}
          href="/admin/books"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={UsersIcon}
          href="/admin/users"
        />
        <StatCard
          title="Categories"
          value={stats.totalCategories}
          icon={TagIcon}
          href="/admin/categories"
        />
        <StatCard
          title="Reviews"
          value={stats.totalReviews}
          icon={StarIcon}
          href="/admin/reviews"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-[var(--wood-brown)] hover:underline">
            View All
          </Link>
        </div>
        {stats.recentOrders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Items</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Link href={`/admin/orders/${order.id}`} className="text-[var(--wood-brown)] hover:underline">
                        #{order.id}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {order.bookOrderItems?.length ?? 0} items
                    </td>
                    <td className="py-3 px-4 font-medium">${order.total_price}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        order.status === "completed" ? "bg-green-100 text-green-800" :
                        order.status === "processing" ? "bg-blue-100 text-blue-800" :
                        order.status === "cancelled" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {order.status}
                      </span>
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
  title: "Admin Dashboard - The Book Haven",
  robots: "noindex",
};