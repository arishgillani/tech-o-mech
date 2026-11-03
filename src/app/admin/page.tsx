
import Link from "next/link";
import { Package, ShoppingBag, ArrowRight } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-6xl">
      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Welcome to the Tech O Mech admin panel.
          Manage your products and customer orders from here.
        </p>
      </div>

      {/* Management Sections */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Products */}
        <Link
          href="/admin/products"
          className="group rounded-xl border border-gray-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Package size={25} />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-gray-900">
            Manage Products
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Add new products, edit existing details, update prices,
            manage stock, and change product images.
          </p>

          <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
            Manage Products
            <ArrowRight
              size={17}
              className="transition group-hover:translate-x-1"
            />
          </div>
        </Link>

        {/* Orders */}
        <Link
          href="/admin/orders"
          className="group rounded-xl border border-gray-200 bg-white p-6 transition hover:border-blue-300 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <ShoppingBag size={25} />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-gray-900">
            Manage Orders
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            View customer orders, check order details, and update
            their order statuses.
          </p>

          <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
            Manage Orders
            <ArrowRight
              size={17}
              className="transition group-hover:translate-x-1"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
