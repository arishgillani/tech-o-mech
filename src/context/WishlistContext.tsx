"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/types/product";

type WishlistContextType = {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

const STORAGE_KEY = "tech-o-mech-wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem(STORAGE_KEY);

      if (savedWishlist) {
        const parsedWishlist: unknown = JSON.parse(savedWishlist);

        if (Array.isArray(parsedWishlist)) {
          setWishlistItems(parsedWishlist as Product[]);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(wishlistItems)
    );
  }, [wishlistItems, isLoaded]);

  function addToWishlist(product: Product) {
    setWishlistItems((currentItems) => {
      const alreadyExists = currentItems.some(
        (item) => item.id === product.id
      );

      if (alreadyExists) {
        return currentItems;
      }

      return [...currentItems, product];
    });
  }

  function removeFromWishlist(productId: number) {
    setWishlistItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  }

  function isInWishlist(productId: number) {
    return wishlistItems.some((item) => item.id === productId);
  }

  function clearWishlist() {
    setWishlistItems([]);
  }

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside a WishlistProvider"
    );
  }

  return context;
}