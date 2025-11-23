import { getSession } from "@/lib/session";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UpdateAccountForm } from "./update-form";

export default async function UpdateAccountPage() {
  const session = await getSession();

  if (!session.user) {
    redirect("/login?next=/account/update");
  }

  return (
    <div className="container max-w-2xl mx-auto py-12">
      <Link href="/account" className="text-sm text-gray-700 hover:underline">
        ← Back to Account
      </Link>
      <h1 className="text-3xl font-medium mb-6 mt-2">Update Information</h1>
      <UpdateAccountForm user={session.user} />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Update Information - The Book Haven",
  robots: "noindex",
};