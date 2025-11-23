import { db } from "@/db";
import { booksTable } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DeleteBookButton } from "./delete-button";

async function getBooks() {
  return db.query.booksTable.findMany({
    orderBy: desc(booksTable.created_at),
  });
}

export default async function AdminBooksPage() {
  const books = await getBooks();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Books</h1>
        <Link
          href="/admin/books/new"
          className="bg-[var(--wood-brown)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          + Add Book
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {books.length === 0 ? (
          <p className="p-6 text-gray-500">No books yet. Add your first book!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Book</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Author</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Price</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Stock</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Featured</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className="border-t hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Image
                          src={book.cover_url}
                          alt={book.title}
                          width={40}
                          height={60}
                          className="w-10 h-15 object-cover rounded shadow"
                        />
                        <div>
                          <p className="font-medium">{book.title}</p>
                          <p className="text-xs text-gray-500">{book.isbn}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{book.author}</td>
                    <td className="py-4 px-6">
                      <span className="font-medium">${book.price}</span>
                      {Number(book.discount_percent) > 0 && (
                        <span className="ml-2 text-xs bg-red-100 text-red-700 px-1 rounded">
                          -{book.discount_percent}%
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`${book.stock_quantity < 10 ? "text-red-600" : "text-gray-600"}`}>
                        {book.stock_quantity}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {book.featured ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/books/${book.id}/edit`}
                          className="text-[var(--wood-brown)] hover:underline text-sm"
                        >
                          Edit
                        </Link>
                        <DeleteBookButton bookId={book.id} bookTitle={book.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Books - Admin - The Book Haven",
  robots: "noindex",
};