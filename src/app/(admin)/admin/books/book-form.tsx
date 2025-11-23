"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Book, Category } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createBookAction, updateBookAction } from "./action";

type BookWithCategories = Book & { category_ids?: string[] };

export function BookForm({
  book,
  categories,
  isEditing = false,
}: {
  book?: BookWithCategories;
  categories: Category[];
  isEditing?: boolean;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    book?.category_ids ?? []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Add selected categories
      selectedCategories.forEach((catId) => {
        formData.append("category_ids", catId);
      });

      const result = isEditing
        ? await updateBookAction(book!.id, formData)
        : await createBookAction(formData);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(isEditing ? "Book updated successfully!" : "Book created successfully!");
        router.push("/admin/books");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!isEditing && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Book ID (slug)</label>
          <Input
            name="id"
            placeholder="e.g., the-great-gatsby"
            defaultValue={book?.id}
            required
          />
          <p className="text-xs text-gray-500">Used in URLs. Cannot be changed later.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Title *</label>
          <Input name="title" placeholder="Book title" defaultValue={book?.title} required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Author *</label>
          <Input name="author" placeholder="Author name" defaultValue={book?.author} required />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          placeholder="Book description"
          defaultValue={book?.description ?? ""}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--wood-brown)]"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Cover URL *</label>
        <Input
          name="cover_url"
          type="url"
          placeholder="https://example.com/cover.jpg"
          defaultValue={book?.cover_url}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Price *</label>
          <Input
            name="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="19.99"
            defaultValue={book?.price}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Discount %</label>
          <Input
            name="discount_percent"
            type="number"
            step="1"
            min="0"
            max="100"
            placeholder="0"
            defaultValue={book?.discount_percent ?? "0"}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Stock *</label>
          <Input
            name="stock_quantity"
            type="number"
            min="0"
            placeholder="100"
            defaultValue={book?.stock_quantity}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">ISBN</label>
          <Input name="isbn" placeholder="978-0-00-000000-0" defaultValue={book?.isbn ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Publisher</label>
          <Input name="publisher" placeholder="Publisher name" defaultValue={book?.publisher ?? ""} />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Year</label>
          <Input
            name="publication_year"
            type="number"
            placeholder="2024"
            defaultValue={book?.publication_year ?? ""}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Page Count</label>
        <Input
          name="page_count"
          type="number"
          min="1"
          placeholder="300"
          defaultValue={book?.page_count ?? ""}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Categories</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => toggleCategory(category.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategories.includes(category.id)
                  ? "bg-[var(--wood-brown)] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        {categories.length === 0 && (
          <p className="text-sm text-gray-500">No categories yet. Create some first.</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="featured"
          id="featured"
          value="true"
          defaultChecked={book?.featured}
          className="w-4 h-4"
        />
        <label htmlFor="featured" className="text-sm font-medium text-gray-700">
          Featured book (shown on homepage)
        </label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Update Book" : "Create Book"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}