import { getSession } from "@/lib/session";
import { CartProvider } from "@/components/cart";
import { SessionProvider } from "@/components/session";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <SessionProvider session={session}>
      <CartProvider initialSession={session}>{children}</CartProvider>
    </SessionProvider>
  );
}