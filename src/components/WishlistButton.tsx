"use client";

import { useEffect, useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import type { Product } from "@/types/product";

type WishlistButtonProps = {
  product: Product;
};

export default function WishlistButton({
  product,
}: WishlistButtonProps) {
  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  const isWishlisted = isInWishlist(product.id);

  function handleWishlist() {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      setMessage("Removed from wishlist");
    } else {
      addToWishlist(product);
      setMessage("Added to wishlist");
    }

    setShowMessage(true);
  }

  useEffect(() => {
    if (!showMessage) return;

    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [showMessage]);

  return (
    <>
      <button
        type="button"
        onClick={handleWishlist}
        aria-label={
          isWishlisted
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
        title={
          isWishlisted
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
        className={`flex h-[42px] w-[52px] items-center justify-center rounded-lg border text-2xl transition cursor-pointer ${isWishlisted
            ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
            : "border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600"
          }`}
      >
        {isWishlisted ? "♥" : "♡"}
      </button>

      <div
        className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform rounded-lg px-5 py-3 text-sm font-medium text-white shadow-lg transition-all duration-500 ease-out ${showMessage
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
          } ${message === "Removed from wishlist"
            ? "bg-red-600"
            : "bg-green-700"
          }`}
        role="status"
        aria-live="polite"
      >
        ✓ {message}
      </div>
    </>
  );
}