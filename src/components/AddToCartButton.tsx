"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

type AddToCartButtonProps = {
  product: Product;
};

export default function AddToCartButton({
  product,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [showMessage, setShowMessage] = useState(false);

  function handleAddToCart() {
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
    });

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
        disabled={!product.inStock}
        onClick={handleAddToCart}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:w-fit cursor-pointer"
      >
        {product.inStock ? "Add to Cart" : "Out of Stock"}
      </button>

      <div
        className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transform rounded-lg bg-green-900 px-5 py-3 text-sm font-medium text-white shadow-lg transition-all duration-500 ease-out ${
          showMessage
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0 pointer-events-none"
        }`}
        role="status"
        aria-live="polite"
      >
        ✓ Item added to the cart
      </div>
    </>
  );
}