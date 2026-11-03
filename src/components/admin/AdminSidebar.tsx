"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  LogOut,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="border-b border-gray-200 px-6 py-6">
        <Link
            href="/"
            className="shrink-0 text-2xl font-black italic tracking-tight text-black"
          >
            Tech<span className="text-blue-600">O</span>Mech
          </Link>

        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-gray-500">
          Admin Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon size={19} />
              {item.name}
            </Link>
          );
        })}

        
      </nav>

      {/* Bottom Actions */}
      <div className="space-y-2 border-t border-gray-200 px-4 py-5">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
        >
          <Store size={19} />
          Back to Store
        </Link>

        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium cursor-pointer text-red-600 transition hover:bg-red-50"
        >
          <LogOut size={19} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}