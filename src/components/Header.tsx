
"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { UserRound, ChevronDown, LogOut } from "lucide-react";

const categories = [
  "Gaming PCs",
  "Monitors",
  "Keyboards",
  "Gaming Mouse",
  "Headsets",
  "Gaming Chairs",
  "Components",
];

export default function Header() {
  const { cartCount } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const fullName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "there";

  const currentPage = searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  const returnTo = encodeURIComponent(
    currentPage.startsWith("/login") || currentPage.startsWith("/signup")
      ? "/"
      : currentPage
  );

  async function handleLogout() {
    setLoggingOut(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    setLoggingOut(false);

    if (error) {
      console.error("Logout failed:", error.message);
      return;
    }

    setShowAccountMenu(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      {/* Main navigation */}
      <div className="mx-auto flex max-w-[1800px] items-center gap-6 p-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          className="shrink-0 text-2xl font-black text-black italic tracking-tight"
        >
          Tech<span className="text-blue-600">O</span>Mech
        </Link>

        {/* Search */}
        <form
          action="/products"
          method="GET"
          className="hidden flex-1 md:block"
        >
          <div className="flex rounded-lg border border-gray-300 bg-gray-50 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <input
              type="search"
              name="search"
              placeholder="Search gaming PCs, monitors, accessories..."
              aria-label="Search products"
              className="w-full bg-transparent px-4 py-3 text-sm outline-none text-black"
            />

            <button
              type="submit"
              aria-label="Search"
              className="rounded-r-lg bg-blue-600 px-5 text-white transition hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </form>

        {/* Customer actions */}
        <nav
          aria-label="Customer navigation"
          className="ml-auto flex shrink-0 items-center gap-4 text-sm"
        >
          {/* Account menu */}
          <div className="relative hidden sm:block">
            {loading ? (
              <span className="text-sm text-gray-500">Account...</span>
            ) : user ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setShowAccountMenu((current) => !current)
                  }
                  className="flex cursor-pointer items-center gap-2 text-black transition hover:text-blue-600"
                  aria-expanded={showAccountMenu}
                  aria-haspopup="true"
                >
                  <UserRound size={20} />

                  <span className="flex flex-col items-start leading-tight">
                    <span className="font-medium">Account</span>
                    <span className="text-xs">Hi, {fullName}</span>
                  </span>

                  <ChevronDown size={14} />
                </button>

                {showAccountMenu && (
                  <div className="absolute right-0 top-full z-50 mt-4 w-56 rounded-xl border border-gray-200 bg-white p-3 shadow-xl">
                    <div className="border-b border-gray-100 px-3 pb-3">
                      <p className="text-sm font-semibold text-gray-900">
                        Hi, {fullName}
                      </p>
                      <p className="mt-1 truncate text-xs text-gray-500">
                        {user.email}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="mt-2 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-gray-800 transition hover:bg-gray-100 disabled:opacity-60"
                    >
                      <LogOut size={18} />
                      {loggingOut ? "Signing out..." : "Sign Out"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setShowAccountMenu((current) => !current)
                  }
                  className="cursor-pointer font-medium text-black hover:text-blue-600"
                  aria-expanded={showAccountMenu}
                  aria-haspopup="true"
                >
                  Sign In
                </button>

                {showAccountMenu && (
                  <div className="absolute right-0 top-full z-50 mt-4 w-72 rounded-xl border border-gray-200 bg-white p-5 shadow-xl">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-base font-bold text-gray-900">
                          Welcome to Tech O Mech
                        </h2>

                        <p className="mt-1 text-sm leading-5 text-gray-600">
                          Sign in to access your account, wishlist and checkout.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowAccountMenu(false)}
                        className="cursor-pointer text-xl leading-none text-gray-400 transition hover:text-gray-700"
                        aria-label="Close account menu"
                      >
                        ×
                      </button>
                    </div>

                    <div className="mt-5 grid gap-3">
                      <Link
                        href={`/login?next=${returnTo}`}
                        onClick={() => setShowAccountMenu(false)}
                        className="rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        Sign In
                      </Link>

                      <Link
                        href={`/signup?next=${returnTo}`}
                        onClick={() => setShowAccountMenu(false)}
                        className="rounded-lg border border-blue-600 bg-white px-4 py-3 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                      >
                        Create Account
                      </Link>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <Link
            href="/wishlist"
            className="hidden font-medium text-black hover:text-blue-600 lg:block"
          >
            Wishlist
          </Link>

          <Link
            href="/cart"
            className="font-semibold text-black hover:text-blue-600"
          >
            Cart ({cartCount})
          </Link>
        </nav>
      </div>

      {/* Product categories */}
      <nav aria-label="Product categories" className="border-t border-gray-100">
        <div className="mx-auto flex max-w-[1200px] gap-20 overflow-x-auto pb-4 text-sm font-medium sm:px-6 lg:px-8">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/products?category=${encodeURIComponent(category)}`}
              className="shrink-0 whitespace-nowrap font-bold text-black transition hover:text-blue-600"
            >
              {category}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
