import { AddToCartBook } from "@/components/add-to-cart-book";
import { getBook } from "@/lib/data";
import { getBookCost } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BookReviewSection } from "./book-reviews";

type Params = { book_id: string };

type Props = {
  params: Promise<Params>;
};

const getBookFromProps = async (props: Props) => {
  const params = await props.params;
  const book = await getBook(params.book_id);
  if (!book) {
    notFound();
  }
  return book;
};

function BookDetailSection({
  title,
  content,
}: {
  title: string;
  content: string | number | null | undefined;
}) {
  if (!content) {
    return null;
  }
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl md:text-2xl font-medium">{title}</h2>
      <p className="text-base md:text-lg text-neutral-700">{content}</p>
    </div>
  );
}

export default async function BookPage(props: Props) {
  const book = await getBookFromProps(props);
  const bookCost = getBookCost(book);

  return (
    <div className="container py-12 flex flex-col gap-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-72">
          <Image
            src={book.cover_url}
            width={288}
            height={432}
            alt={book.title}
            className="w-full aspect-[2/3] object-cover rounded shadow-lg"
            priority
          />
        </div>

        <div className="md:flex-1">
          <h1 className="text-3xl md:text-5xl font-medium mb-2">
            {book.title}
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 mb-4">
            by {book.author}
          </p>
          <p className="text-base md:text-lg mb-4">{book.description}</p>
          <p className="text-xl md:text-2xl mb-6 text-gray-700">
            {bookCost.price === bookCost.originalPrice ? (
              <>${bookCost.price}</>
            ) : (
              <>
                <span className="line-through text-neutral-500">
                  ${bookCost.originalPrice}
                </span>{" "}
                ${bookCost.price}{" "}
                <span className="bg-rose-600 text-white font-semibold py-1 px-2 rounded text-sm">
                  ({parseInt(book.discount_percent)}% off)
                </span>
              </>
            )}
          </p>
          <AddToCartBook book={book} />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <BookDetailSection title="Publisher" content={book.publisher} />
        <BookDetailSection title="Publication Year" content={book.publication_year} />
        <BookDetailSection title="Pages" content={book.page_count} />
        <BookDetailSection title="ISBN" content={book.isbn} />
        <BookReviewSection book={book} />
      </div>
    </div>
  );
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const book = await getBookFromProps(props);

  return {
    title: `${book.title} - The Book Haven`,
    description: book.description,
    openGraph: {
      images: [
        {
          url: book.cover_url,
          alt: book.title,
        },
      ],
    },
  };
}