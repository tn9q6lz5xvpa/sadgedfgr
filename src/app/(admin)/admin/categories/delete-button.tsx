"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteCategoryAction } from "./action";

export function DeleteCategoryButton({
  categoryId,
  categoryName,
  bookCount,
}: {
  categoryId: string;
  categoryName: string;
  bookCount: number;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const message = bookCount > 0
      ? `"${categoryName}" has ${bookCount} books. Deleting will remove this category from those books. Continue?`
      : `Are you sure you want to delete "${categoryName}"?`;

    if (!confirm(message)) return;

    setIsDeleting(true);
    try {
      const result = await deleteCategoryAction(categoryId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Category deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete category");
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
      {isDeleting ? "..." : "Delete"}
    </button>
  );
}