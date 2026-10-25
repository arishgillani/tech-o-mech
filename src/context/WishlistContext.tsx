"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/types/product";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

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

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();

  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    async function loadWishlist() {
      if (!user) {
        setWishlistItems([]);
        setIsLoaded(true);
        return;
      }

      const supabase = createClient();

      const { data, error } = await supabase
        .from("wishlists")
        .select(
          `
            product_id,
            products (
              id,
              slug,
              name,
              category,
              price,
              image,
              description,
              brand,
              rating,
              in_stock
            )
          `
        )
        .eq("user_id", user.id);

      if (error) {
        console.error("Failed to load wishlist:", error.message);
        setWishlistItems([]);
        setIsLoaded(true);
        return;
      }

      const products = (data ?? [])
  .map((item) => {
    const product = Array.isArray(item.products)
      ? item.products[0]
      : item.products;

    if (!product) return null;

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      price: Number(product.price),
      image: product.image,
      description: product.description,
      brand: product.brand,
      rating: Number(product.rating),
      inStock: product.in_stock,
    };
  })
  .filter((product): product is Product => product !== null);
      setWishlistItems(products);
      setIsLoaded(true);
    }

    loadWishlist();
  }, [user, authLoading]);

  async function addToWishlist(product: Product) {
    if (!user) return;

    const alreadyExists = wishlistItems.some(
      (item) => item.id === product.id
    );

    if (alreadyExists) return;

    setWishlistItems((currentItems) => [
      ...currentItems,
      product,
    ]);

    const supabase = createClient();

    const { error } = await supabase.from("wishlists").insert({
      user_id: user.id,
      product_id: product.id,
    });

    if (error) {
      console.error("Failed to add wishlist item:", error.message);

      setWishlistItems((currentItems) =>
        currentItems.filter((item) => item.id !== product.id)
      );
    }
  }

  async function removeFromWishlist(productId: number) {
    if (!user) return;

    setWishlistItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );

    const supabase = createClient();

    const { error } = await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);

    if (error) {
      console.error(
        "Failed to remove wishlist item:",
        error.message
      );
    }
  }

  function isInWishlist(productId: number) {
    return wishlistItems.some((item) => item.id === productId);
  }

  async function clearWishlist() {
    if (!user) return;

    setWishlistItems([]);

    const supabase = createClient();

    const { error } = await supabase
      .from("wishlists")
      .delete()
      .eq("user_id", user.id);

    if (error) {
      console.error(
        "Failed to clear wishlist:",
        error.message
      );
    }
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