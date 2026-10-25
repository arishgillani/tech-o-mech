
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { UserRound, Heart, ShoppingBag, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-6xl px-4 py-16">
        <p className="text-gray-500">Loading your account...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center px-4 py-16 text-center">
        <UserRound className="mb-4 h-12 w-12 text-gray-400" />
        <h1 className="text-2xl font-bold text-gray-900">
          Sign in to your account
        </h1>
        <p className="mt-2 max-w-md text-gray-600">
          Sign in to view your account information and manage your Tech O Mech activity.
        </p>
        <Link
          href="/login?next=%2Faccount"
          className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Sign In
        </Link>
      </main>
    );
  }

  const fullName =
    user.user_metadata?.full_name || "Tech O Mech Customer";

  return (
    <main className="min-h-[65vh] bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            TECH O MECH
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            My Account
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your account and explore your activity.
          </p>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <UserRound className="h-8 w-8" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                {fullName}
              </h2>
              <p className="mt-1 break-all text-gray-600">
                {user.email}
              </p>
              <p className="mt-2 text-sm text-green-700">
                Signed in
              </p>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </section>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            href="/wishlist"
            className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-md"
          >
            <Heart className="h-7 w-7 text-blue-600" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              My Wishlist
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              View the products you have saved for later.
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-blue-600 group-hover:text-blue-700">
              View Wishlist →
            </span>
          </Link>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <ShoppingBag className="h-7 w-7 text-blue-600" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              My Orders
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Your order history will appear here once we build the demo checkout and order system.
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-gray-400">
              Coming soon
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
