import { getBookCost } from "@/lib/utils";
import { Book } from "@/types";
import Image from "next/image";

export function BookCard({
  book,
  imageProps,
}: {
  book: Book;
  imageProps?: Partial<React.ComponentProps<typeof Image>>;
}) {
  const bookCost = getBookCost(book);

  return (
    <div className="group flex flex-col items-center gap-2 p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors">
      <div className="relative w-full aspect-[2/3] bg-neutral-100 rounded-lg overflow-hidden mb-2 shadow-md">
        <Image
          src={book.cover_url}
          alt={book.title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
          width={192}
          height={288}
          {...imageProps}
        />
        <div className="absolute top-2 right-2 flex flex-col items-end gap-2">
          {book.featured && (
            <span className="bg-gradient-to-tr from-emerald-600 to-emerald-700 text-white text-xs font-bold py-1.5 px-4 rounded">
              Featured
            </span>
          )}
          {Number(book.discount_percent) > 0 && (
            <span className="bg-gradient-to-tr from-rose-600 to-rose-500 text-white text-xs font-bold py-1.5 px-4 rounded">
              {parseInt(book.discount_percent)}% off
            </span>
          )}
        </div>
      </div>
      <h3 className="text-xl text-black w-full text-left line-clamp-1">{book.title}</h3>
      <p className="text-sm text-neutral-600 w-full text-left">
        by {book.author}
      </p>
      <p className="text-sm text-neutral-500 line-clamp-2 w-full text-left">
        {book.description}
      </p>
      <p className="text-sm text-neutral-600 w-full text-left">
        {bookCost.price === bookCost.originalPrice ? (
          <>${bookCost.price}</>
        ) : (
          <>
            <span className="line-through">${bookCost.originalPrice}</span> $
            {bookCost.price}
          </>
        )}
      </p>
    </div>
  );
}