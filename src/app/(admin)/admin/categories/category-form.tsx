"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { createCategoryAction } from "./action";

export function CategoryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await createCategoryAction(formData);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Category created successfully!");
        e.currentTarget.reset();
      }
    } catch (error) {
      toast.error("Failed to create category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Category ID</label>
        <Input name="id" placeholder="e.g., sci-fi" required />
        <p className="text-xs text-gray-500">Used in URLs</p>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Name</label>
        <Input name="name" placeholder="e.g., Science Fiction" required />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          placeholder="Category description (optional)"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--wood-brown)]"
        />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating..." : "Create Category"}
      </Button>
    </form>
  );
}