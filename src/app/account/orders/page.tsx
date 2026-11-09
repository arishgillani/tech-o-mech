
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Package,
  RefreshCw,
} from "lucide-react";

type Order = {
  id: number;
  created_at: string;
  total: number;
  status: string;
};

type OrderItem = {
  id: number;
  order_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
};

const currency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// Get color based on order status
function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case "placed":
      return "bg-gray-100 text-black";

    case "processing":
    case "shipped":
    case "delivered":
      return "bg-green-50 text-green-700";

    case "cancelled":
      return "bg-red-50 text-red-700";

    default:
      return "bg-gray-100 text-black";
  }
}

export default function OrdersPage() {
  const { user, loading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      if (loading) return;

      if (!user) {
        setOrders([]);
        setOrderItems([]);
        setOrdersLoading(false);
        return;
      }

      setOrdersLoading(true);
      setErrorMessage("");

      const supabase = createClient();

      const { data, error } = await supabase
        .from("orders")
        .select("id, created_at, total, status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (cancelled) return;

      if (error) {
        console.error("Failed to load orders:", error);
        setErrorMessage("We couldn't load your orders. Please try again.");
        setOrdersLoading(false);
        return;
      }

      const fetchedOrders = (data ?? []) as Order[];
      setOrders(fetchedOrders);

      if (fetchedOrders.length === 0) {
        setOrderItems([]);
        setOrdersLoading(false);
        return;
      }

      const { data: items, error: itemsError } = await supabase
        .from("order_items")
        .select("id, order_id, product_name, quantity, unit_price")
        .in(
          "order_id",
          fetchedOrders.map((order) => order.id)
        );

      if (cancelled) return;

      if (itemsError) {
        console.error("Failed to load order items:", itemsError);
        setErrorMessage(
          "Your orders loaded, but their product details couldn't be loaded."
        );
      } else {
        setOrderItems((items ?? []) as OrderItem[]);
      }

      setOrdersLoading(false);
    }

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [user, loading, retry]);

  if (loading) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-5xl px-4 py-12">
        <p className="text-gray-500">Loading your account...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-4 py-12 text-center">
        <ShoppingBag className="mb-4 h-12 w-12 text-gray-400" />
        <h1 className="text-2xl font-bold text-gray-900">
          Sign in to view your orders
        </h1>
        <p className="mt-2 text-gray-600">
          Your order history is available after you sign in.
        </p>
        <Link
          href="/login?next=%2Faccount%2Forders"
          className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Sign In
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[65vh] bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/account"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Account
        </Link>

        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600">TECH O MECH</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">
            View your order history and purchased products.
          </p>
        </div>

        {ordersLoading ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white p-12 text-gray-500">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading your orders...
          </div>
        ) : errorMessage ? (
          <section className="rounded-2xl border border-red-200 bg-white p-8 text-center">
            <p className="text-red-600">{errorMessage}</p>
            <button
              type="button"
              onClick={() => setRetry((value) => value + 1)}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </section>
        ) : orders.length === 0 ? (
          <section className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-300" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              No orders yet
            </h2>
            <p className="mt-2 text-gray-600">
              When you place a demo order, it will appear here.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Explore Products
            </Link>
          </section>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              {orders.length} {orders.length === 1 ? "order" : "orders"} found
            </p>

            {orders.map((order) => {
              const items = orderItems.filter(
                (item) => item.order_id === order.id
              );

              const isExpanded = expandedOrder === order.id;

              return (
                <section
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedOrder(isExpanded ? null : order.id)
                    }
                    aria-expanded={isExpanded}
                    className="flex w-full cursor-pointer flex-col gap-4 p-5 text-left transition hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <ShoppingBag className="h-6 w-6" />
                      </div>

                      <div>
                        <h2 className="font-semibold text-gray-900">
                          Order #{order.id}
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                          Placed on {formatDate(order.created_at)}
                        </p>

                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyle(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="sm:text-right">
                        <p className="text-xs text-gray-500">Order total</p>
                        <p className="mt-1 font-semibold text-gray-900">
                          {currency(Number(order.total))}
                        </p>
                      </div>

                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50 p-5 sm:p-6">
                      <h3 className="mb-4 font-semibold text-gray-900">
                        Purchased Products
                      </h3>

                      {items.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          No product details are available for this order.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-start justify-between gap-4"
                            >
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.product_name}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                  Quantity: {item.quantity} ×{" "}
                                  {currency(Number(item.unit_price))}
                                </p>
                              </div>

                              <p className="shrink-0 font-medium text-gray-900">
                                {currency(
                                  Number(item.unit_price) * item.quantity
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-5 flex justify-between border-t border-gray-200 pt-4 font-semibold text-gray-900">
                        <span>Order Total</span>
                        <span>{currency(Number(order.total))}</span>
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
