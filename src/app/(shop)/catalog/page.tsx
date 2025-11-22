import { BookCard } from "@/components/book-card";
import {
  getCategories,
  getBooks,
  getBooksByCategoryId,
} from "@/lib/data";
import { Metadata } from "next";
import Link from "next/link";
import { CategoryList } from "./category-list";

async function BookList({
  categoryId,
  searchQuery,
}: {
  categoryId?: string;
  searchQuery?: string;
}) {
  let books = categoryId
    ? await getBooksByCategoryId(categoryId)
    : await getBooks();

  if (searchQuery) {
    books = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  return (
    <div>
      {searchQuery && (
        <div className="text-neutral-500 text-sm">
          Showing results for &ldquo;{searchQuery}&rdquo;.{" "}
          <Link
            href={"/catalog" + (categoryId ? `?category=${categoryId}` : "")}
            className="underline"
          >
            Clear
          </Link>
        </div>
      )}
      {!books.length && (
        <div className="text-center text-lg text-neutral-700 p-24">
          No books found
        </div>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books.map((book, index) => (
          <Link key={book.id} href={`/catalog/${book.id}`}>
            <BookCard
              book={book}
              imageProps={index < 4 ? { priority: true } : undefined}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

type SearchParams = { category?: string; q?: string };

export default async function CatalogPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await searchParamsPromise;
  const categories = await getCategories();

  return (
    <div className="container flex flex-col md:flex-row py-12">
      <div className="md:w-[200px]">
        <CategoryList
          categoryId={searchParams.category}
          categories={categories}
          searchQuery={searchParams.q}
        />
      </div>
      <div className="md:flex-1">
        <BookList
          categoryId={searchParams.category}
          searchQuery={searchParams.q}
        />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Catalog - AI Oven",
  description: "Browse our collection of books by category.",
};