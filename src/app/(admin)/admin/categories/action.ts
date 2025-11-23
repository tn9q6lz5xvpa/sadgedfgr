"use server";

import { db } from "@/db";
import { categoriesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const categorySchema = z.object({
  id: z.string().min(1, "Category ID is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

export async function createCategoryAction(formData: FormData) {
  try {
    const rawData = {
      id: formData.get("id"),
      name: formData.get("name"),
      description: formData.get("description") || undefined,
    };

    const parsed = categorySchema.safeParse(rawData);
    if (!parsed.success) {
      return { error: parsed.error.errors.map((e) => e.message).join(", ") };
    }

    // Check if ID already exists
    const existing = await db.query.categoriesTable.findFirst({
      where: eq(categoriesTable.id, parsed.data.id),
    });
    if (existing) {
      return { error: "A category with this ID already exists" };
    }

    await db.insert(categoriesTable).values(parsed.data);

    revalidatePath("/admin/categories");
    revalidatePath("/catalog");

    return { success: true };
  } catch (error) {
    console.error("Error creating category:", error);
    return { error: "Failed to create category" };
  }
}

export async function updateCategoryAction(categoryId: string, formData: FormData) {
  try {
    const rawData = {
      id: categoryId,
      name: formData.get("name"),
      description: formData.get("description") || undefined,
    };

    const parsed = categorySchema.safeParse(rawData);
    if (!parsed.success) {
      return { error: parsed.error.errors.map((e) => e.message).join(", ") };
    }

    await db
      .update(categoriesTable)
      .set({ name: parsed.data.name, description: parsed.data.description })
      .where(eq(categoriesTable.id, categoryId));

    revalidatePath("/admin/categories");
    revalidatePath("/catalog");

    return { success: true };
  } catch (error) {
    console.error("Error updating category:", error);
    return { error: "Failed to update category" };
  }
}

export async function deleteCategoryAction(categoryId: string) {
  try {
    await db.delete(categoriesTable).where(eq(categoriesTable.id, categoryId));

    revalidatePath("/admin/categories");
    revalidatePath("/catalog");

    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { error: "Failed to delete category" };
  }
}