import { BookCard } from "@/components/book-card";
import { getBooks, getFeaturedBooks } from "@/lib/data";
import { getBookCost } from "@/lib/utils";
import Link from "next/link";

export default async function Home() {
  const featuredBooks = await getFeaturedBooks();
  const allBooks = await getBooks();
  
  // Get 3 random books for "Today's picks"
  const todaysPicks = allBooks
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-10">
      <section className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="col-span-2 bg-[var(--warm-white)] p-6 rounded-2xl book-card">
          <h1 className="text-3xl md:text-4xl">Welcome to The Book Haven</h1>
          <p className="mt-3 text-[rgba(78,59,49,0.7)]">
            A curated collection of books chosen for their craft, story and soul.
            Find your next treasured read.
          </p>
          <div className="mt-5">
            <a href="/catalog" className="btn-wood">
              Browse the Catalog
            </a>
          </div>
        </div>

        <aside className="bg-[var(--warm-white)] p-6 rounded-2xl book-card">
          <h3 className="font-semibold">Today&apos;s picks</h3>
          <ul className="mt-4 space-y-3 text-sm text-[rgba(78,59,49,0.8)]">
            {todaysPicks.map((book) => {
              const cost = getBookCost(book);
              return (
                <li key={book.id}>
                  <Link href={`/catalog/${book.id}`} className="hover:underline">
                    📚 {book.title} — ${cost.price}
                  </Link>
                </li>
              );
            })}
          </ul>
        </aside>
      </section>

      <section>
        <h2 className="text-2xl mb-4">Featured Titles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
            <Link key={book.id} href={`/catalog/${book.id}`}>
              <BookCard book={book} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}