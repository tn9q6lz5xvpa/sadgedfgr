"use server";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateUserRoleAction(userId: number, role: string) {
  try {
    if (role !== "admin" && role !== "user") {
      return { error: "Invalid role" };
    }

    await db
      .update(usersTable)
      .set({ role: role as "admin" | "user" })
      .where(eq(usersTable.id, userId));

    revalidatePath("/admin/users");

    return { success: true };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { error: "Failed to update user role" };
  }
}