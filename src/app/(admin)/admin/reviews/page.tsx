import { db } from "@/db";
import { bookReviewsTable } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Metadata } from "next";
import { format } from "date-fns";
import { StarIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { DeleteReviewButton } from "./delete-button";

async function getReviews() {
  return db.query.bookReviewsTable.findMany({
    orderBy: desc(bookReviewsTable.created_at),
    with: {
      book: true,
      user: {
        columns: {
          first_name: true,
          last_name: true,
          email: true,
        },
      },
    },
  });
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`w-4 h-4 ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

export default async function AdminReviewsPage() {
  const reviews = await getReviews();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Reviews</h1>
        <p className="text-gray-600">{reviews.length} total reviews</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {reviews.length === 0 ? (
          <p className="p-6 text-gray-500">No reviews yet.</p>
        ) : (
          <div className="divide-y">
            {reviews.map((review) => (
              <div key={review.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <StarRating rating={review.rating} />
                      <span className="text-sm text-gray-500">
                        {format(new Date(review.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{review.comment || "No comment"}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-500">
                        By:{" "}
                        <span className="font-medium text-gray-700">
                          {review.user?.first_name} {review.user?.last_name}
                        </span>
                        {review.user?.email && (
                          <span className="text-gray-400 ml-1">({review.user.email})</span>
                        )}
                      </span>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-500">
                        Book:{" "}
                        <Link
                          href={`/catalog/${review.book_id}`}
                          className="font-medium text-[var(--wood-brown)] hover:underline"
                        >
                          {review.book?.title || review.book_id}
                        </Link>
                      </span>
                    </div>
                  </div>
                  <DeleteReviewButton reviewId={review.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Reviews - Admin - The Book Haven",
  robots: "noindex",
};