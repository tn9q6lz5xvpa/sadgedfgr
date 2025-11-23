import { getOrderByIdAndUserId } from "@/lib/data";
import { getSession } from "@/lib/session";
import { BookOrderItemEntity } from "@/db/schema";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type Params = { order_id: string };
type Props = { params: Promise<Params> };

function BookOrderItemCard({ orderItem }: { orderItem: BookOrderItemEntity }) {
  const book = orderItem.book;
  return (
    <div className="flex items-start gap-4">
      {book && (
        <Image
          src={book.cover_url}
          width={64}
          height={96}
          alt={book.title}
          className="object-cover w-16 h-24 rounded shadow"
        />
      )}
      <div className="flex-1 flex flex-col">
        <p className="text-lg font-semibold">{book?.title || orderItem.book_id}</p>
        {book?.author && (
          <p className="text-sm text-neutral-600">by {book.author}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-neutral-500">Quantity:</span>
          <span className="text-neutral-700 font-semibold">{orderItem.quantity}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="text-lg text-neutral-800">${orderItem.subtotal}</p>
      </div>
    </div>
  );
}

const getOrderFromProps = async (props: Props) => {
  const session = await getSession();
  if (!session.user) {
    redirect("/login");
  }

  const params = await props.params;
  const order = await getOrderByIdAndUserId({
    orderId: parseInt(params.order_id),
    userId: session.user.id,
  });

  if (!order) {
    notFound();
  }

  return order;
};

export default async function OrderPage(props: Props) {
  const order = await getOrderFromProps(props);
  const itemCount = order.bookOrderItems?.length ?? 0;

  return (
    <div className="container max-w-4xl mx-auto py-12">
      <Link href="/orders" className="text-sm text-gray-700 hover:underline">
        ← Back to Orders
      </Link>
      <h1 className="text-3xl font-medium mb-4 mt-2">Order #{order.id}</h1>
      <div className="flex flex-col gap-1 mb-6">
        <div className="flex items-center gap-4 p-2 bg-gray-50 rounded">
          <div className="bg-teal-700 text-teal-50 px-2 py-0.5 rounded text-sm">
            Delivery Address
          </div>
          <div>
            {order.shipping_address}, {order.shipping_city},{" "}
            {order.shipping_country_code}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 mb-4">
        {order.bookOrderItems?.map((orderItem) => (
          <BookOrderItemCard key={orderItem.book_id} orderItem={orderItem} />
        ))}
      </div>
      <div className="flex gap-4 justify-between items-center border-t py-4">
        <div className="text-gray-900 text-xl">
          {itemCount} item{itemCount !== 1 && "s"}
        </div>
        <div className="text-gray-700 text-2xl">${order.total_price}</div>
      </div>
    </div>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const order = await getOrderFromProps(props);
  return {
    title: `Order #${order.id} - The Book Haven`,
    robots: "noindex",
  };
}