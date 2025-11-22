import { Metadata } from "next";
import { CheckoutPageContent } from "./page-content";

export default function CheckoutPage() {
  const paypalClientId = process.env.PAYPAL_CLIENT_ID || "";
  
  return <CheckoutPageContent paypalClientId={paypalClientId} />;
}

export const metadata: Metadata = {
  title: "Checkout",
  robots: "noindex",
};
