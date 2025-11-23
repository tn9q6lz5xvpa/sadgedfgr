import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { AdminSidebar } from "./components/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Check if user is logged in and is an admin
  if (!session.user) {
    redirect("/login?next=/admin");
  }

  // Check admin role - you need to fetch the full user with role from DB
  const { db } = await import("@/db");
  const { usersTable } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, session.user.id),
  });

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8 ml-64">{children}</main>
    </div>
  );
}