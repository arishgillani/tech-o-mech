"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {
  const {
    wishlistItems,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!showMessage) return;

    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [showMessage]);

  function handleAddToCart(
    item: (typeof wishlistItems)[number]
  ) {
    addToCart({
      id: item.id,
      slug: item.slug,
      name: item.name,
      price: item.price,
      image: item.image,
    });

    setMessage("Added to cart");
    setShowMessage(true);
  }

  function handleRemoveFromWishlist(productId: number) {
    removeFromWishlist(productId);

    setMessage("Removed from wishlist");
    setShowMessage(true);
  }

  if (wishlistItems.length === 0) {
    return (
      <main className="min-h-screen bg-white px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-4xl text-blue-600">
            ♡
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Your Wishlist Is Empty
          </h1>

          <p className="mt-3 text-gray-600">
            Save products you like and come back to them later.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              My Wishlist
            </h1>

            <p className="mt-2 text-gray-600">
              Products you&apos;ve saved for later.
            </p>
          </div>

          <button
            type="button"
            onClick={clearWishlist}
            className="text-sm font-medium cursor-pointer text-red-600 hover:text-red-800"
          >
            Clear Wishlist
          </button>
        </div>

        {/* Wishlist Items */}
        <div className="mt-10 space-y-4">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                {/* Product Image */}
                <Link
                  href={`/products/${item.slug}`}
                  className="relative h-44 w-full shrink-0 rounded-lg bg-gray-50 sm:h-36 sm:w-36"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="144px"
                    className="object-contain"
                  />
                </Link>

                {/* Product Information */}
                <div className="flex-1">
                  <Link
                    href={`/products/${item.slug}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {item.name}
                  </Link>

                  <p className="mt-2 text-lg font-bold text-gray-900">
                    ${item.price.toFixed(2)}
                  </p>

                  <div className="mt-3">
                    <span className="rounded-full bg-yellow-50 px-3 py-1.5 text-sm font-medium text-yellow-800">
                      ★ {item.rating.toFixed(1)} / 5
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(item)}
                      className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold cursor-pointer text-white transition hover:bg-blue-700"
                    >
                      Add to Cart
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveFromWishlist(item.id)
                      }
                      aria-label={`Remove ${item.name} from wishlist`}
                      title="Remove from wishlist"
                      className="flex h-10 w-10 items-center justify-center rounded-lg border cursor-pointer border-gray-300 text-xl text-red-600 transition hover:border-red-300 hover:bg-red-50"
                    >
                      ♥
                    </button>

                    <Link
                      href={`/products/${item.slug}`}
                      className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast Message */}
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
    </main>
  );
}