import { db } from "@/db";
import { Metadata } from "next";
import Link from "next/link";
import { BookForm } from "../book-form";

async function getCategories() {
  return db.query.categoriesTable.findMany();
}

export default async function NewBookPage() {
  const categories = await getCategories();

  return (
    <div>
      <Link href="/admin/books" className="text-sm text-gray-600 hover:underline">
        ← Back to Books
      </Link>
      <h1 className="text-3xl font-bold mt-2 mb-8">Add New Book</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-3xl">
        <BookForm categories={categories} />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Add Book - Admin - The Book Haven",
  robots: "noindex",
};