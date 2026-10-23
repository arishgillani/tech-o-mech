"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-white px-6 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-4xl">
            🛒
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Your Cart Is Empty
          </h1>

          <p className="mt-3 text-gray-600">
            Looks like you haven't added anything to your cart yet.
          </p>

          <Link
            href="/products"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Shopping Cart
            </h1>

            <p className="mt-2 text-gray-600">
              Review your selected products before continuing.
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-sm font-medium text-red-600 hover:text-red-800 cursor-pointer"
          >
            Clear Cart
          </button>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Cart Items */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  {/* Product Image */}
                  <Link
                    href={`/products/${item.slug}`}
                    
                    className="relative h-32 w-full shrink-0 rounded-lg bg-gray-50 sm:w-32"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="128px"
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

                    {/* Quantity Controls */}
                    <div className="mt-4 flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-600">
                        Quantity:
                      </span>

                      <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="px-3 py-1.5 text-lg font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          −
                        </button>

                        <span className="min-w-10 px-3 text-center text-sm font-semibold text-gray-900">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-3 py-1.5 text-lg font-medium text-gray-700 hover:bg-gray-100 cursor-pointer"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="mt-4 text-sm font-medium text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-gray-500">Item Total</p>

                    <p className="mt-1 text-xl font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <aside className="h-fit rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Items</span>
                <span>
                  {cartItems.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                alert(
                  "Checkout functionality will be added later. This is a demo store."
                )
              }
              className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
            >
              Proceed to Checkout
            </button>

            <Link
              href="/products"
              className="mt-3 block w-full rounded-lg border border-gray-300 bg-white px-5 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Continue Shopping
            </Link>

            <p className="mt-5 text-center text-xs leading-5 text-gray-500">
              Demo store — no real purchases or payments are processed.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}