"use server";

import { db } from "@/db";
import { bookReviewsTable, booksTable } from "@/db/schema";
import { embedReviews } from "@/lib/embedder";
import rateLimit from "@/lib/rate-limit";
import { getSession } from "@/lib/session";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

const schema = zfd.formData({
  book_id: z.string(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().optional(),
});

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export async function createBookReview(formData: FormData) {
  await limiter.check(5);

  const session = await getSession();
  if (!session.user) {
    throw new Error("Unauthorized");
  }

  const data = schema.parse(formData);

  const book = await db.query.booksTable.findFirst({
    where: eq(booksTable.id, data.book_id),
  });
  if (!book) {
    throw new Error("Book not found");
  }

  const reviews = await db
    .insert(bookReviewsTable)
    .values({
      book_id: data.book_id,
      rating: data.rating,
      comment: data.comment,
      user_id: session.user.id,
    })
    .returning();

  // Note: You may need to create a separate embedBookReviews function
  // or modify embedReviews to handle book reviews
  // void embedReviews(reviews, book);

  revalidatePath(`/catalog/${data.book_id}`);
}

export async function deleteBookReview(id: number) {
  const session = await getSession();
  if (!session.user) {
    throw new Error("Unauthorized");
  }

  const [review] = await db
    .delete(bookReviewsTable)
    .where(
      and(
        eq(bookReviewsTable.id, id),
        eq(bookReviewsTable.user_id, session.user.id),
      ),
    )
    .returning();

  if (!review) {
    throw new Error("Review not found");
  }

  revalidatePath(`/catalog/${review.book_id}`);
}