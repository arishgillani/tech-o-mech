"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
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

  const { user, loading: authLoading } = useAuth();

  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  function handleWishlist() {
    if (authLoading) return;

    // Logged-out user
    if (!user) {
      setShowLoginPopup(true);
      return;
    }

    // Logged-in user
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
    <div className="relative">
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
        className={`flex h-[42px] w-[52px] items-center justify-center rounded-lg border text-2xl transition cursor-pointer ${
          isWishlisted
            ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
            : "border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600"
        }`}
      >
        {isWishlisted ? "♥" : "♡"}
      </button>

      {/* Logged-out sign-in popup */}
      {showLoginPopup && (
        <div className="absolute right-0 top-full z-50 mt-3 w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-9 shrink-0 items-center justify-center rounded-full border border-red-300 text-red-700">
              ♡
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-5 ml-3 text-gray-900">
                Sign in to save your favorites.
              </p>

              <Link
                href="/login"
                onClick={() => setShowLoginPopup(false)}
                className="mt-3 block w-full rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Sign in or create account
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setShowLoginPopup(false)}
              className="cursor-pointer text-xl leading-none text-gray-400 transition hover:text-gray-700"
              aria-label="Close sign-in popup"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Logged-in wishlist toast */}
      <div
        className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform rounded-lg px-5 py-3 text-sm font-medium text-white shadow-lg transition-all duration-500 ease-out ${
          showMessage
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        } ${
          message === "Removed from wishlist"
            ? "bg-red-600"
            : "bg-green-700"
        }`}
        role="status"
        aria-live="polite"
      >
        ✓ {message}
      </div>
    </div>
  );
}