import { BookCard } from "@/components/book-card";
import { ProductCard } from "@/components/product-card";
import { getBooks, getProducts } from "@/lib/data";
import { Metadata } from "next";
import Link from "next/link";

async function SearchResults({
  searchQuery,
}: {
  searchQuery?: string;
}) {
  if (!searchQuery) {
    return (
      <div className="text-center text-lg text-neutral-700 p-24">
        Enter a search term to find books and products
      </div>
    );
  }

  const [books, products] = await Promise.all([
    getBooks(),
    getProducts(),
  ]);

  // Filter books
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Filter products
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const hasResults = filteredBooks.length > 0 || filteredProducts.length > 0;

  return (
    <div className="space-y-12">
      {!hasResults && (
        <div className="text-center text-lg text-neutral-700 p-24">
          No results found for &ldquo;{searchQuery}&rdquo;
        </div>
      )}

      {filteredBooks.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-[var(--wood-brown)]">
            Books ({filteredBooks.length})
          </h2>
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
      )}

      {filteredProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-[var(--wood-brown)]">
            Products ({filteredProducts.length})
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <ProductCard
                  product={product}
                  imageProps={index < 3 ? { priority: true } : undefined}
                />
              </Link>
            ))}
          </div>
        </div>
      )}
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
        <h1 className="text-3xl font-bold mb-4 text-[var(--wood-brown)]">
          Search
        </h1>
        {searchQuery && (
          <div className="text-neutral-500 text-sm">
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
  description: "Search for books and products at The Book Haven",
};

