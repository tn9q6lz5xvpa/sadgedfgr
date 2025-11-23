"use server";

import { db } from "@/db";
import { booksTable, bookCategoriesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const bookSchema = z.object({
  id: z.string().min(1, "Book ID is required"),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().optional(),
  cover_url: z.string().url("Invalid cover URL"),
  price: z.string().min(1, "Price is required"),
  discount_percent: z.string().default("0"),
  featured: z.boolean().default(false),
  isbn: z.string().optional(),
  publisher: z.string().optional(),
  publication_year: z.coerce.number().optional(),
  page_count: z.coerce.number().optional(),
  stock_quantity: z.coerce.number().min(0, "Stock cannot be negative"),
  category_ids: z.array(z.string()).optional(),
});

export async function createBookAction(formData: FormData) {
  try {
    const categoryIds = formData.getAll("category_ids") as string[];
    
    const rawData = {
      id: formData.get("id"),
      title: formData.get("title"),
      author: formData.get("author"),
      description: formData.get("description") || undefined,
      cover_url: formData.get("cover_url"),
      price: formData.get("price"),
      discount_percent: formData.get("discount_percent") || "0",
      featured: formData.get("featured") === "true",
      isbn: formData.get("isbn") || undefined,
      publisher: formData.get("publisher") || undefined,
      publication_year: formData.get("publication_year") || undefined,
      page_count: formData.get("page_count") || undefined,
      stock_quantity: formData.get("stock_quantity"),
      category_ids: categoryIds,
    };

    const parsed = bookSchema.safeParse(rawData);
    if (!parsed.success) {
      return { error: parsed.error.errors.map((e) => e.message).join(", ") };
    }

    const { category_ids, ...bookData } = parsed.data;

    // Check if book ID already exists
    const existing = await db.query.booksTable.findFirst({
      where: eq(booksTable.id, bookData.id),
    });
    if (existing) {
      return { error: "A book with this ID already exists" };
    }

    await db.transaction(async (tx) => {
      await tx.insert(booksTable).values(bookData);

      if (category_ids && category_ids.length > 0) {
        await tx.insert(bookCategoriesTable).values(
          category_ids.map((categoryId) => ({
            book_id: bookData.id,
            category_id: categoryId,
          }))
        );
      }
    });

    revalidatePath("/admin/books");
    revalidatePath("/catalog");

    return { success: true };
  } catch (error) {
    console.error("Error creating book:", error);
    return { error: "Failed to create book" };
  }
}

export async function updateBookAction(bookId: string, formData: FormData) {
  try {
    const categoryIds = formData.getAll("category_ids") as string[];
    
    const rawData = {
      id: bookId,
      title: formData.get("title"),
      author: formData.get("author"),
      description: formData.get("description") || undefined,
      cover_url: formData.get("cover_url"),
      price: formData.get("price"),
      discount_percent: formData.get("discount_percent") || "0",
      featured: formData.get("featured") === "true",
      isbn: formData.get("isbn") || undefined,
      publisher: formData.get("publisher") || undefined,
      publication_year: formData.get("publication_year") || undefined,
      page_count: formData.get("page_count") || undefined,
      stock_quantity: formData.get("stock_quantity"),
      category_ids: categoryIds,
    };

    const parsed = bookSchema.safeParse(rawData);
    if (!parsed.success) {
      return { error: parsed.error.errors.map((e) => e.message).join(", ") };
    }

    const { category_ids, id, ...bookData } = parsed.data;

    await db.transaction(async (tx) => {
      await tx.update(booksTable).set(bookData).where(eq(booksTable.id, bookId));

      // Update categories
      await tx.delete(bookCategoriesTable).where(eq(bookCategoriesTable.book_id, bookId));
      
      if (category_ids && category_ids.length > 0) {
        await tx.insert(bookCategoriesTable).values(
          category_ids.map((categoryId) => ({
            book_id: bookId,
            category_id: categoryId,
          }))
        );
      }
    });

    revalidatePath("/admin/books");
    revalidatePath(`/admin/books/${bookId}/edit`);
    revalidatePath("/catalog");
    revalidatePath(`/catalog/${bookId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating book:", error);
    return { error: "Failed to update book" };
  }
}

export async function deleteBookAction(bookId: string) {
  try {
    await db.delete(booksTable).where(eq(booksTable.id, bookId));

    revalidatePath("/admin/books");
    revalidatePath("/catalog");

    return { success: true };
  } catch (error) {
    console.error("Error deleting book:", error);
    return { error: "Failed to delete book" };
  }
}