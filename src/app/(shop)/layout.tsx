import { getSession } from "@/lib/session";
import { CartProvider } from "@/components/cart";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return <CartProvider initialSession={session}>{children}</CartProvider>;
}

