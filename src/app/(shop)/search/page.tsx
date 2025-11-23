import { BookCard } from "@/components/book-card";
import { getBooks } from "@/lib/data";
import { Metadata } from "next";
import Link from "next/link";
import { SearchForm } from "./search-form";

async function SearchResults({ searchQuery }: { searchQuery?: string }) {
  if (!searchQuery) {
    return (
      <div className="text-center text-lg text-neutral-700 p-24">
        Enter a search term to find books
      </div>
    );
  }

  const books = await getBooks();

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.publisher?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (filteredBooks.length === 0) {
    return (
      <div className="text-center text-lg text-neutral-700 p-24">
        No books found for &ldquo;{searchQuery}&rdquo;
      </div>
    );
  }

  return (
    <div>
      <p className="text-neutral-600 mb-6">
        Found {filteredBooks.length} book{filteredBooks.length !== 1 && "s"}
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBooks.map((book, index) => (
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

type SearchParams = { q?: string };

export default async function SearchPage({
  searchParams: searchParamsPromise,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await searchParamsPromise;
  const searchQuery = searchParams.q;

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6 text-[var(--wood-brown)]">
          Search Books
        </h1>
        <SearchForm initialQuery={searchQuery} />
        {searchQuery && (
          <div className="text-neutral-500 text-sm mt-4">
            Showing results for &ldquo;{searchQuery}&rdquo;.{" "}
            <Link href="/search" className="underline">
              Clear
            </Link>
          </div>
        )}
      </div>
      <SearchResults searchQuery={searchQuery} />
    </div>
  );
}

export const metadata: Metadata = {
  title: "Search - The Book Haven",
  description: "Search for books at The Book Haven",
};