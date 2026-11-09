
"use client";

import { useEffect, useState } from "react";

type OrderItem = {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
};

type Order = {
    id: number;
    user_id: string;
    full_name: string;
    email: string;
    shipping_address: string;
    shipping_city: string;
    shipping_state: string;
    shipping_zip: string;
    phone: string | null;
    total: number;
    status: "placed" | "processing" | "shipped" | "delivered" | "cancelled";
    created_at: string;
    order_items: OrderItem[];
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await fetch("/api/admin/orders");
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || "Failed to load orders.");
                }

                setOrders(result.orders || []);
            } catch (error) {
                console.error("Fetch orders error:", error);
                setError(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while loading orders."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, []);

    function formatDate(date: string) {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    function formatPrice(price: number) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price);
    }


    function getStatusStyle(status: Order["status"]) {
        switch (status) {
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



    async function handleStatusUpdate() {
        if (!selectedOrder) return;

        setUpdatingStatus(true);
        setStatusMessage("");

        try {
            const response = await fetch(
                `/api/admin/orders/${selectedOrder.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: selectedOrder.status,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to update status.");
            }

            // Update the orders table
            setOrders((currentOrders) =>
                currentOrders.map((order) =>
                    order.id === selectedOrder.id
                        ? { ...order, status: result.order.status }
                        : order
                )
            );

            setStatusMessage("Order status updated successfully.");
        } catch (error) {
            setStatusMessage(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setUpdatingStatus(false);
        }
    }


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Orders
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    View and manage customer orders.
                </p>
            </div>

            {loading ? (
                <p className="py-10 text-center text-gray-500">
                    Loading orders...
                </p>
            ) : error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            ) : orders.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-gray-500">
                    No orders found.
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                    <table className="w-full min-w-[750px] text-left">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr className="text-sm text-gray-600">
                                <th className="px-5 py-4 font-semibold">Order ID</th>
                                <th className="px-5 py-4 font-semibold">Customer</th>
                                <th className="px-5 py-4 font-semibold">Date</th>
                                <th className="px-5 py-4 font-semibold">Total</th>
                                <th className="px-5 py-4 font-semibold">Status</th>
                                <th className="px-5 py-4 font-semibold">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="text-sm">
                                    <td className="px-5 py-4 font-semibold text-gray-900">
                                        #{order.id}
                                    </td>

                                    <td className="px-5 py-4">
                                        <p className="font-medium text-gray-900">
                                            {order.full_name}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {order.email}
                                        </p>
                                    </td>

                                    <td className="px-5 py-4 text-gray-600">
                                        {formatDate(order.created_at)}
                                    </td>

                                    <td className="px-5 py-4 font-medium text-gray-900">
                                        {formatPrice(Number(order.total))}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyle(order.status)}`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedOrder(order)}
                                            className="font-medium cursor-pointer text-blue-600 hover:text-blue-800"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Order #{selectedOrder.id}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Placed on {formatDate(selectedOrder.created_at)}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                                className="text-2xl cursor-pointer text-gray-400 hover:text-gray-700"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="space-y-6 p-6">
                            {/* Customer Information */}
                            <div>
                                <h3 className="mb-3 font-semibold text-gray-900">
                                    Customer Information
                                </h3>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <p>
                                        <span className="font-medium text-gray-900">Name:</span>{" "}
                                        {selectedOrder.full_name}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-900">Email:</span>{" "}
                                        {selectedOrder.email}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-900">Phone:</span>{" "}
                                        {selectedOrder.phone || "Not provided"}
                                    </p>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                                <h3 className="mb-3 font-semibold text-gray-900">
                                    Shipping Address
                                </h3>

                                <p className="text-sm leading-6 text-gray-600">
                                    {selectedOrder.shipping_address}
                                    <br />
                                    {selectedOrder.shipping_city},{" "}
                                    {selectedOrder.shipping_state}{" "}
                                    {selectedOrder.shipping_zip}
                                </p>
                            </div>

                            {/* Ordered Products */}
                            <div>
                                <h3 className="mb-3 font-semibold text-gray-900">
                                    Ordered Products
                                </h3>

                                <div className="overflow-hidden rounded-lg border border-gray-200">
                                    {selectedOrder.order_items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between gap-4 border-b border-gray-100 p-4 last:border-b-0"
                                        >
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {item.product_name}
                                                </p>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Quantity: {item.quantity}
                                                </p>
                                            </div>

                                            <p className="whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatPrice(
                                                    Number(item.unit_price) * item.quantity
                                                )}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                <span className="font-semibold text-gray-900">
                                    Order Total
                                </span>
                                <span className="text-xl font-bold text-gray-900">
                                    {formatPrice(Number(selectedOrder.total))}
                                </span>
                            </div>


                            {/* Update Order Status */}
                            <div className="border-t border-gray-200 pt-5">
                                <h3 className="mb-3 font-semibold text-gray-900">
                                    Update Order Status
                                </h3>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <select
                                        value={selectedOrder.status}
                                        onChange={(e) =>
                                            setSelectedOrder({
                                                ...selectedOrder,
                                                status: e.target.value as Order["status"],
                                            })
                                        }
                                        className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="placed">Placed</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>

                                    <button
                                        type="button"
                                        onClick={handleStatusUpdate}
                                        disabled={updatingStatus}
                                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {updatingStatus ? "Saving..." : "Save Status"}
                                    </button>
                                </div>

                                {statusMessage && (
                                    <p className={`mt-3 text-sm ${statusMessage === "Order status updated successfully."
                                        ? "text-green-600"
                                        : "text-red-600"
                                        }`}>
                                        {statusMessage}
                                    </p>
                                )}
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-gray-200 px-6 py-4 text-right">
                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                                className="rounded-lg bg-gray-100 px-5 py-2 text-sm font-medium cursor-pointer text-gray-700 transition hover:bg-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
