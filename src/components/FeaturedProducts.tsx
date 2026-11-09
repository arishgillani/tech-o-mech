"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const products = [
    {
        id: 1,
        name: "Gaming Desktop - AMD Ryzen 7 9800X3D - NVIDIA GeForce RTX 5070 12GB - 32GB DDR5 Memory - 2TB SSD Storage - Black",
        category: "Gaming PC",
        price: 1299.99,
        image: "/products/gaming-pc.png",
        href: "/products/performance-gaming-desktop",
    },
    {
        id: 2,
        name: "27-inch Gaming Monitor - QHD 2560 x 1440 - 180Hz Refresh Rate - 1ms Response Time - IPS Panel - Black",
        category: "Monitor",
        price: 279.99,
        image: "/products/gaming-monitor.png",
        href: "/products/27-inch-gaming-monitor",
    },
    {
        id: 3,
        name: "75% Wireless Compact Black & White Mechanical Gaming Keyboard - Tactile Mechanical Switches - Custom Two-Tone Keycaps - Black & White",
        category: "Keyboard",
        price: 69.99,
        image: "/products/mechanical-keyboard.png",
        href: "/products/rgb-mechanical-keyboard",
    },
    {
        id: 4,
        name: "Wired Gaming Mouse - 12,000 DPI Optical Sensor - 6 Programmable Buttons - RGB Lighting - USB Connection - Black",
        category: "Gaming Mouse",
        price: 29.99,
        image: "/products/gaming-mouse.png",
        href: "/products/precision-wired-gaming-mouse",
    },
];

export default function FeaturedProducts() {

    const productsContainerRef = useRef<HTMLDivElement>(null);
    const [activeProductIndex, setActiveProductIndex] = useState(0);

    function scrollProducts(direction: "left" | "right") {
        if (!productsContainerRef.current) return;

        const container = productsContainerRef.current;
        const card = container.firstElementChild as HTMLElement;

        const scrollAmount = card.offsetWidth + 16;

        const nextIndex =
            direction === "right"
                ? Math.min(activeProductIndex + 1, products.length - 1)
                : Math.max(activeProductIndex - 1, 0);

        container.scrollTo({
            left: nextIndex * scrollAmount,
            behavior: "smooth",
        });

        setActiveProductIndex(nextIndex);
    }

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
                    className="shrink-0 text-sm font-semibold px-4 py-2 rounded-2xl bg-blue-600 text-white transition hover:bg-blue-800"
                >
                    View All 
                </Link>
            </div>

            {/* Product grid */}
            <div className="relative">
                {/* Left arrow */}
                <button
                    type="button"
                    onClick={() => scrollProducts("left")}
                    aria-label="Previous product"
                    disabled={activeProductIndex === 0}
                    className="absolute left-2 top-55 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl text-gray-900 shadow-md transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:opacity-100 disabled:shadow-none sm:hidden"
                >
                    ‹
                </button>

                {/* Right arrow */}
                <button
                    type="button"
                    onClick={() => scrollProducts("right")}
                    aria-label="Next product"
                    disabled={activeProductIndex === products.length - 1}
                    className="absolute right-2 top-55 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl text-gray-900 shadow-md transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:border-gray-300 disabled:bg-gray-300 disabled:text-gray-500 disabled:opacity-100 disabled:shadow-none sm:hidden"
                >
                    ›
                </button>

                <div
                    ref={productsContainerRef}
                    onScroll={(e) => {
                        const container = e.currentTarget;
                        const card = container.firstElementChild as HTMLElement;

                        if (card) {
                            const index = Math.round(
                                container.scrollLeft / (card.offsetWidth + 16)
                            );

                            setActiveProductIndex(
                                Math.min(index, products.length - 1)
                            );
                        }
                    }}
                    className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4"
                >

                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={product.href}
                            className="group min-w-full min-h-[500px] snap-start overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg sm:min-w-0"
                        >
                            {/* Product image */}
                            <div className="relative h-60 bg-gray-50 sm:h-48">
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
                                <p className="mt-3. text-xs font-medium uppercase tracking-wide text-gray-500">
                                    {product.category}
                                </p>

                                <h3 className="mt-5 min-h-12 text-lg font-semibold text-gray-900 transition group-hover:text-blue-600">
                                    {product.name}
                                </h3>

                                <p className="mt-5 text-lg font-bold text-gray-900">
                                    {product.price.toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    })}
                                </p>
                            </div>
                        </Link>
                    ))}

                </div>

            </div>
        </section>
    );
}
