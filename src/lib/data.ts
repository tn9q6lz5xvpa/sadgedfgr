"use server";

import { db } from "@/db";
import {
  collectionsTable,
  ordersTable,
  productCollectionsTable,
  productReviewsTable,
  productsTable,
  booksTable,
  categoriesTable,
  bookCategoriesTable,
  bookReviewsTable,
  bookOrderItemsTable,
} from "@/db/schema";
import { Book, Category, Collection, Product } from "@/types";
import { and, desc, eq, inArray, ne } from "drizzle-orm";
import { cache } from "react";

export const getCollections = cache(async () => {
  return db.query.collectionsTable.findMany();
});

export const getCollectionsByIds = cache(
  async (ids: string[]): Promise<Collection[]> => {
    return db.query.collectionsTable.findMany({
      where: inArray(collectionsTable.id, ids),
    });
  },
);

export const getProducts = cache(async (): Promise<Product[]> => {
  return db.query.productsTable.findMany();
});

export const getProduct = cache(async (id: string): Promise<Product | null> => {
  return db.query.productsTable
    .findFirst({
      where: eq(collectionsTable.id, id),
      with: {
        productReviews: {
          with: {
            user: {
              columns: {
                first_name: true,
                last_name: true,
              },
            },
          },
          orderBy: desc(productReviewsTable.created_at),
        },
      },
    })
    .then((product) => product ?? null);
});

export const getProductsByCollectionId = cache(
  async (id: string): Promise<Product[]> => {
    const productCollections = await db.query.productCollectionsTable.findMany({
      where: eq(productCollectionsTable.collection_id, id),
      with: {
        product: true,
      },
    });

    return productCollections.map((pc) => pc.product);
  },
);

export const getOrdersByUserId = cache(async (userId: number) => {
  return db.query.ordersTable.findMany({
    where: and(
      eq(ordersTable.user_id, userId),
      ne(ordersTable.status, "pending"),
    ),
    with: {
      bookOrderItems: {
        with: {
          book: true,
        },
      },
    },
    orderBy: desc(ordersTable.created_at),
  });
});

export const getOrderByIdAndUserId = cache(
  async ({ orderId, userId }: { orderId: number; userId: number }) => {
    return db.query.ordersTable
      .findFirst({
        where: and(
          eq(ordersTable.id, orderId),
          eq(ordersTable.user_id, userId),
        ),
        with: {
          bookOrderItems: {
            with: {
              book: true,
            },
          },
        },
      })
      .then((order) => order ?? null);
  },
);

export const getFeaturedProducts = cache(async (): Promise<Product[]> => {
  return db.query.productsTable.findMany({
    limit: 4,
    where: eq(productsTable.featured, true),
  });
});

export const getCategories = cache(async (): Promise<Category[]> => {
  return db.query.categoriesTable.findMany();
});

export const getCategoriesByIds = cache(
  async (ids: string[]): Promise<Category[]> => {
    return db.query.categoriesTable.findMany({
      where: inArray(categoriesTable.id, ids),
    });
  }
);

export const getBooks = cache(async (): Promise<Book[]> => {
  return db.query.booksTable.findMany();
});

export const getBook = cache(async (id: string): Promise<Book | null> => {
  return db.query.booksTable
    .findFirst({
      where: eq(booksTable.id, id),
      with: {
        bookReviews: {
          with: {
            user: {
              columns: {
                first_name: true,
                last_name: true,
              },
            },
          },
          orderBy: desc(bookReviewsTable.created_at),
        },
      },
    })
    .then((book) => book ?? null);
});

export const getBooksByCategoryId = cache(
  async (id: string): Promise<Book[]> => {
    const bookCategories = await db.query.bookCategoriesTable.findMany({
      where: eq(bookCategoriesTable.category_id, id),
      with: {
        book: true,
      },
    });
    return bookCategories.map((bc) => bc.book);
  }
);

export const getFeaturedBooks = cache(async (): Promise<Book[]> => {
  return db.query.booksTable.findMany({
    limit: 4,
    where: eq(booksTable.featured, true),
  });
});
