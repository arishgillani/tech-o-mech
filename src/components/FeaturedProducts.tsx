import Link from "next/link";
import Image from "next/image";

const products = [
    {
        id: 1,
        name: "Performance Gaming Desktop",
        category: "Gaming PC",
        price: 1299.99,
        image: "/products/gaming-pc.png",
        href: "/products/performance-gaming-desktop",
    },
    {
        id: 2,
        name: "27-inch Gaming Monitor",
        category: "Monitor",
        price: 279.99,
        image: "/products/gaming-monitor.png",
        href: "/products/gaming-monitor",
    },
    {
        id: 3,
        name: "RGB Mechanical Keyboard",
        category: "Keyboard",
        price: 79.99,
        image: "/products/mechanical-keyboard.png",
        href: "/products/mechanical-keyboard",
    },
    {
        id: 4,
        name: "Wireless Gaming Mouse",
        category: "Gaming Mouse",
        price: 49.99,
        image: "/products/gaming-mouse.png",
        href: "/products/wireless-gaming-mouse",
    },
];

export default function FeaturedProducts() {
    return (
        <section className="mx-auto w-full max-w-[1900px] px-6 py-14 sm:px-8 lg:px-12">
            {/* Section heading */}
            <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        Featured Products
                    </h2>

                    <p className="mt-2 text-sm text-gray-600 sm:text-base">
                        Popular picks for your next gaming setup.
                    </p>
                </div>

                <Link
                    href="/products"
                    className="shrink-0 text-sm font-semibold text-blue-600 transition hover:text-blue-800"
                >
                    View All →
                </Link>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {products.map((product) => (
                    <Link
                        key={product.id}
                        href={product.href}
                        className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
                    >
                        {/* Product image */}
                        <div className="relative h-40 bg-gray-50 sm:h-48">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="(min-width: 1024px) 25vw, 50vw"
                                className="object-contain p-4 transition duration-200 group-hover:scale-105"
                            />
                        </div>

                        {/* Product details */}
                        <div className="p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                {product.category}
                            </p>

                            <h3 className="mt-2 min-h-12 font-semibold text-gray-900 transition group-hover:text-blue-600">
                                {product.name}
                            </h3>

                            <p className="mt-3 text-lg font-bold text-gray-900">
                                {product.price.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                })}
                            </p>
                        </div>
                    </Link>
                ))}

            </div>
        </section>
    );
}
