"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-white px-6 py-16">
      <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
          ✓
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Demo Order Placed!
        </h1>

        <p className="mt-3 text-gray-600">
          Your order has been saved successfully. No payment was collected.
        </p>

        {orderId && (
          <p className="mt-4 text-sm text-gray-700">
            Order number: <span className="font-semibold">#{orderId}</span>
          </p>
        )}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/account"
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Go to My Account
          </Link>

          <Link
            href="/products"
            className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center bg-white">
          <p className="text-gray-600">Loading confirmation...</p>
        </main>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
