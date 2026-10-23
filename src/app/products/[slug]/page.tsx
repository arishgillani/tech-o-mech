import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AddToCartButton from "@/components/AddToCartButton";
import WishlistButton from "@/components/WishlistButton";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !product) {
    notFound();
  }

  const formattedProduct = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: Number(product.price),
    image: product.image,
    description: product.description,
    brand: product.brand,
    rating: Number(product.rating),
    inStock: product.in_stock,
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-gray-900 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/products"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back to Products
        </Link>

        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <div className="flex min-h-[320px] items-center justify-center rounded-2xl bg-gray-50 p-6 sm:min-h-[450px]">
            <Image
              src={formattedProduct.image}
              alt={formattedProduct.name}
              width={700}
              height={700}
              priority
              className="h-auto max-h-[420px] w-full object-contain"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
              {formattedProduct.category}
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {formattedProduct.name}
            </h1>

            <p className="mt-4 text-3xl font-bold text-gray-900">
              ${formattedProduct.price.toFixed(2)}
            </p>

            <p className="mt-4 text-base leading-7 text-gray-600">
              {formattedProduct.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
              <span className="rounded-full bg-yellow-50 px-3 py-2 font-medium text-yellow-800">
                ★ {formattedProduct.rating.toFixed(1)} / 5
              </span>

              <span
                className={
                  formattedProduct.inStock
                    ? "font-medium text-green-700"
                    : "font-medium text-red-600"
                }
              >
                {formattedProduct.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              Brand: {formattedProduct.brand}
            </div>

            <div className="mt-8 flex items-center gap-3">
              <AddToCartButton product={formattedProduct} />
              <WishlistButton product={formattedProduct} />
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Demo store — no real purchases or payments are processed.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}