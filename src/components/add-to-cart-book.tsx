"use client";

import { Book, Product } from "@/types";
import { useRef } from "react";
import { toast } from "sonner";
import { useCart } from "@/components/cart";
import { Button } from "@/components/ui/button";

export function AddToCartBook({ book }: { book: Book }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cart = useCart();

  const addToCart = () => {
    const quantity = inputRef.current?.valueAsNumber;
    if (!quantity) {
      toast.error("Please enter a quantity");
      return;
    }
    
    // Convert book to product-like structure for cart compatibility
    const productFromBook: Product = {
      id: book.id,
      name: book.title,
      description: book.description ?? null,
      price: book.price,
      discount_percent: book.discount_percent,
      image_urls: [book.cover_url],
      stock_quantity: book.stock_quantity,
      featured: book.featured,
      ingredients: null,
      nutritional_info: null,
      allergen_info: null,
      serving_suggestions: null,
      storage_instructions: null,
    };

    cart.dispatch({
      type: "add",
      product: productFromBook,
      quantity: quantity,
    });
    
    toast.success(`Added "${book.title}" to cart`);
  };

  const onBlur = () => {
    if (!inputRef.current) return;
    const quantity = inputRef.current?.valueAsNumber;
    if (!Number.isInteger(quantity)) {
      inputRef.current.value = "1";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        type="number"
        className="w-20 h-10 text-center border border-neutral-300 rounded"
        defaultValue={1}
        min={1}
        step={1}
        onBlur={onBlur}
        aria-label="Quantity"
      />
      <Button onClick={addToCart}>Add to Cart</Button>
    </div>
  );
}