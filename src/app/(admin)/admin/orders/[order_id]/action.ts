"use server";

import { db } from "@/db";
import { ordersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateOrderStatusAction(orderId: number, status: string) {
  try {
    const validStatuses = ["processing", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return { error: "Invalid status" };
    }

    await db
      .update(ordersTable)
      .set({ status: status as "processing" | "completed" | "cancelled" })
      .where(eq(ordersTable.id, orderId));

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { error: "Failed to update order status" };
  }
}