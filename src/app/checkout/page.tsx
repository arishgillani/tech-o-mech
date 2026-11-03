
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { user, loading } = useAuth();
  const { cartItems, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?next=%2Fcheckout");
      return;
    }

    if (user) {
      setEmail(user.email ?? "");
      setFullName(
        user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          "",
      );
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-600">Loading checkout...</p>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-white px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Your Cart Is Empty
        </h1>
        <p className="mt-3 text-gray-600">
          Add products to your cart before checking out.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: Number(item.id),
            quantity: item.quantity,
          })),
          fullName,
          email,
          address,
          city,
          state,
          zipCode,
          phone,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to place your order.",
        );
      }

      if (!result.orderId) {
        throw new Error(
          "The order response did not include an order number.",
        );
      }

      clearCart();

      router.push(
        `/order-confirmation?orderId=${encodeURIComponent(String(result.orderId))}`,
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-6 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1200px]">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Checkout
        </h1>
        <p className="mt-2 text-gray-600">
          Enter your shipping details to continue with your demo order.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]"
        >
          {errorMessage && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 lg:col-span-2"
            >
              {errorMessage}
            </p>
          )}

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-gray-900">
              Shipping Information
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(event) =>
                    setFullName(event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="you@example.com"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Street Address
                </label>
                <input
                  id="address"
                  name="address"
                  autoComplete="street-address"
                  required
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="House number and street"
                />
              </div>

              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  autoComplete="address-level2"
                  required
                  value={city}
                  onChange={(event) =>
                    setCity(event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="City"
                />
              </div>

              <div>
                <label
                  htmlFor="state"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  autoComplete="address-level1"
                  required
                  value={state}
                  onChange={(event) =>
                    setState(event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="State"
                />
              </div>

              <div>
                <label
                  htmlFor="zipCode"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  ZIP Code
                </label>
                <input
                  id="zipCode"
                  name="zipCode"
                  autoComplete="postal-code"
                  required
                  value={zipCode}
                  onChange={(event) =>
                    setZipCode(event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="ZIP code"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Phone Number (Optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Phone number"
                />
              </div>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Demo checkout only. Do not enter payment card information.
            </p>
          </section>

          <aside className="h-fit rounded-xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="mt-4 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting
                ? "Placing Order..."
                : "Place Demo Order"}
            </button>

            <Link
              href="/cart"
              className="mt-3 block w-full rounded-lg border border-gray-300 bg-white px-5 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Back to Cart
            </Link>

            <p className="mt-5 text-center text-xs leading-5 text-gray-500">
              No real purchases or payments are processed.
            </p>
          </aside>
        </form>
      </div>
    </main>
  );
}
