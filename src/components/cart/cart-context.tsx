"use client";

import { Cart, FullAppSession, Product } from "@/types";
import { createContext, ReactNode, useContext, useEffect, useReducer, useRef } from "react";
import { syncCart } from "@/lib/cart";

type CartContextType = {
  cart: Cart;
  dispatch: (action: CartAction) => void;
  totalQuantities: number;
};

const CartContext = createContext({} as CartContextType);

type CartAction =
  | { type: "add"; product: Product; quantity: number }
  | { type: "remove"; productId: string }
  | {
      type: "clear";
    }
  | { type: "update"; product: Product; quantity: number };

const cartReducer = (state: Cart, action: CartAction) => {
  switch (action.type) {
    case "add": {
      const existingItem = state.items.find(
        (item) => item.product.id === action.product.id,
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: item.quantity + action.quantity }
              : item,
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            product: action.product,
            quantity: action.quantity,
            product_id: action.product.id,
          },
        ],
      };
    }

    case "remove": {
      return {
        ...state,
        items: state.items.filter(
          (item) => item.product.id !== action.productId,
        ),
      };
    }

    case "clear": {
      return { items: [] };
    }

    case "update": {
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.product.id
            ? { ...item, quantity: action.quantity }
            : item,
        ),
      };
    }
  }
};

export function CartProvider({
  children,
  initialSession,
}: {
  children: ReactNode;
  initialSession: FullAppSession;
}) {
  const [cart, dispatch] = useReducer(cartReducer, initialSession.cart);

  const totalQuantities = cart.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // Track if this is the initial mount to avoid syncing on first render
  const isInitialMount = useRef(true);

  // Sync cart to server whenever it changes (but skip initial mount)
  useEffect(() => {
    // Skip sync on initial mount - the cart is already loaded from the server
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    const syncCartToServer = async () => {
      try {
        await syncCart({
          items: cart.items.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
          })),
        });
      } catch (error) {
        console.error("Failed to sync cart to server:", error);
      }
    };

    syncCartToServer();
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        dispatch,
        totalQuantities,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
