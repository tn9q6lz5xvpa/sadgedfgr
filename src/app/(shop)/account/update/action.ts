"use server";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { getSession, setSession } from "@/lib/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country_code: z.string().optional(),
});

export async function updateAccountAction(formData: FormData) {
  const session = await getSession();

  if (!session.user) {
    return { error: "You must be logged in to update your account" };
  }

  const rawData = {
    first_name: formData.get("first_name"),
    last_name: formData.get("last_name"),
    email: formData.get("email"),
    phone_number: formData.get("phone_number") || undefined,
    address: formData.get("address") || undefined,
    city: formData.get("city") || undefined,
    country_code: formData.get("country_code") || undefined,
  };

  const parsed = updateSchema.safeParse(rawData);

  if (!parsed.success) {
    const errorMessage = parsed.error.errors.map((e) => e.message).join(", ");
    return { error: errorMessage };
  }

  const data = parsed.data;

  try {
    // Check if email is already taken by another user
    if (data.email !== session.user.email) {
      const existingUser = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, data.email),
      });

      if (existingUser) {
        return { error: "Email is already taken by another account" };
      }
    }

    // Update user in database
    const [updatedUser] = await db
      .update(usersTable)
      .set({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number || null,
        address: data.address || null,
        city: data.city || null,
        country_code: data.country_code || null,
      })
      .where(eq(usersTable.id, session.user.id))
      .returning({
        id: usersTable.id,
        first_name: usersTable.first_name,
        last_name: usersTable.last_name,
        email: usersTable.email,
        phone_number: usersTable.phone_number,
        address: usersTable.address,
        city: usersTable.city,
        country_code: usersTable.country_code,
      });

    // Update session with new user data
    await setSession({
      user: updatedUser,
    });

    revalidatePath("/account");
    revalidatePath("/account/update");

    return { success: true };
  } catch (error) {
    console.error("Error updating account:", error);
    return { error: "Failed to update account. Please try again." };
  }
}