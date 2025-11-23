"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteReviewAction } from "./action";

export function DeleteReviewButton({ reviewId }: { reviewId: number }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    setIsDeleting(true);
    try {
      const result = await deleteReviewAction(reviewId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Review deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete review");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:underline text-sm disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}