"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(categoryFromUrl);
  const [sort, setSort] = useState("featured");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }

        const data = await response.json();
        setProducts(data.products);
      } catch {
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesSearch = `${product.name} ${product.brand} ${product.description}`
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesCategory =
        !category || product.category === category;

      return matchesSearch && matchesCategory;
    });

    switch (sort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [products, search, category, sort]);

  return (
    <main className="min-h-screen bg-white px-6 py-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1900px]">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          All Products
        </h1>

        <p className="mt-3 text-gray-600">
          Explore our collection of gaming PCs, monitors, and accessories.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-600"
          >
            <option value="">All Categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-600"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>

        {!loading && !error && (
          <p className="mt-6 text-sm text-gray-500">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        )}

        {loading && (
          <p className="mt-8 text-gray-600">Loading products...</p>
        )}

        {error && (
          <p className="mt-8 text-red-600">{error}</p>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="py-16 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              No products found
            </h2>

            <p className="mt-2 text-gray-600">
              Try another search or category.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("");
                setSort("featured");
              }}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group block overflow-hidden rounded-xl border border-gray-200 bg-white transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <div className="relative h-56 bg-gray-50">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <p className="text-sm text-gray-500">
                    {product.category}
                  </p>

                  <h2 className="mt-2 min-h-12 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                    {product.name}
                  </h2>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </p>

                    <p className="text-sm text-amber-600">
                      ★ {product.rating}
                    </p>
                  </div>

                  <p className="mt-3 text-sm text-gray-600">
                    {product.description}
                  </p>

                  <p
                    className={`mt-4 text-sm font-medium ${
                      product.inStock
                        ? "text-green-700"
                        : "text-red-600"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </p>

                  <p className="mt-4 text-sm font-semibold text-blue-600">
                    View Product →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
