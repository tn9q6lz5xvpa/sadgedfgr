import { db } from "@/db";
import { booksTable, bookCategoriesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookForm } from "../../book-form";

type Props = { params: Promise<{ book_id: string }> };

async function getBook(bookId: string) {
  const book = await db.query.booksTable.findFirst({
    where: eq(booksTable.id, bookId),
  });
  
  if (!book) return null;

  const bookCategories = await db.query.bookCategoriesTable.findMany({
    where: eq(bookCategoriesTable.book_id, bookId),
  });

  return {
    ...book,
    category_ids: bookCategories.map((bc) => bc.category_id),
  };
}

async function getCategories() {
  return db.query.categoriesTable.findMany();
}

export default async function EditBookPage({ params }: Props) {
  const { book_id } = await params;
  const [book, categories] = await Promise.all([
    getBook(book_id),
    getCategories(),
  ]);

  if (!book) {
    notFound();
  }

  return (
    <div>
      <Link href="/admin/books" className="text-sm text-gray-600 hover:underline">
        ← Back to Books
      </Link>
      <h1 className="text-3xl font-bold mt-2 mb-8">Edit Book</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 max-w-3xl">
        <BookForm book={book} categories={categories} isEditing />
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { book_id } = await params;
  return {
    title: `Edit Book - Admin - The Book Haven`,
    robots: "noindex",
  };
}