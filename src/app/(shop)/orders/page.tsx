import { getOrdersByUserId } from "@/lib/data";
import { getSession } from "@/lib/session";
import { Order } from "@/types";
import { format } from "date-fns";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const getDescription = (order: Order) => {
  const bookItems = order.bookOrderItems?.slice(0, 3) ?? [];
  const remaining = (order.bookOrderItems?.length ?? 0) - 3;

  const itemNames = bookItems.map((item) => item.book?.title).join(", ");
  const remainingText = remaining > 0 ? ` and ${remaining} more` : "";

  return `${itemNames}${remainingText}`;
};

function OrderCard({ order }: { order: Order }) {
  const firstBookItem = order.bookOrderItems?.[0];

  return (
    <div className="bg-gray-50 p-4 border-l-4 border-[var(--wood-brown)] hover:bg-gray-100 flex">
      {firstBookItem?.book?.cover_url && (
        <Image
          src={firstBookItem.book.cover_url}
          alt={firstBookItem.book.title}
          width={96}
          height={144}
          className="w-24 h-36 object-cover rounded shadow"
        />
      )}
      <div className="flex-1 flex flex-col ml-4">
        <h2 className="text-lg font-medium">Order #{order.id}</h2>
        <p className="text-gray-700 text-sm mb-2">
          {format(new Date(order.created_at), "MMMM d, yyyy h:mm a")}
        </p>
        <p className="text-gray-700 text-sm mb-2">{getDescription(order)}</p>
        <p className="text-gray-600 text-sm">
          {order.bookOrderItems?.length ?? 0} item{(order.bookOrderItems?.length ?? 0) !== 1 && "s"} · ${order.total_price}
        </p>
      </div>
    </div>
  );
}

export default async function OrdersPage() {
  const session = await getSession();
  if (!session.user) {
    redirect("/login");
  }

  const orders = await getOrdersByUserId(session.user.id);

  return (
    <div className="container max-w-4xl mx-auto py-12">
      <h1 className="text-3xl font-medium mb-4">My Orders</h1>
      {!orders.length && (
        <p className="text-lg text-gray-700">
          You haven&apos;t placed any orders yet.
        </p>
      )}
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <Link key={order.id} href={`/orders/${order.id}`}>
            <OrderCard order={order} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "My Orders - The Book Haven",
  robots: "noindex",
};