"use server";

import { db } from "@/db";
import { bookReviewsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteReviewAction(reviewId: number) {
  try {
    const review = await db.query.bookReviewsTable.findFirst({
      where: eq(bookReviewsTable.id, reviewId),
    });

    await db.delete(bookReviewsTable).where(eq(bookReviewsTable.id, reviewId));

    revalidatePath("/admin/reviews");
    if (review) {
      revalidatePath(`/catalog/${review.book_id}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { error: "Failed to delete review" };
  }
}