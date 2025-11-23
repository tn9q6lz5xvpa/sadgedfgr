"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteBookAction } from "./action";

export function DeleteBookButton({ bookId, bookTitle }: { bookId: string; bookTitle: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${bookTitle}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteBookAction(bookId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Book deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete book");
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