"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { updateCategoryAction } from "./action";

export function EditCategoryButton({ category }: { category: Category }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await updateCategoryAction(category.id, formData);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Category updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      toast.error("Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="text-[var(--wood-brown)] hover:underline text-sm"
      >
        Edit
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-semibold mb-4">Edit Category</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <Input name="name" defaultValue={category.name} required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              defaultValue={category.description ?? ""}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--wood-brown)]"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
            <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}