
import Image from "next/image";
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
    <main className="min-h-screen bg-white px-4 py-8 text-gray-900 sm:px-6 lg:px-10 lg:mt-10">
      <div className="mx-auto max-w-7xl">

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">

          {/* Product Image */}
          <div className="lg:col-span-5">
            <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 sm:min-h-[480px]">
              <Image
                src={formattedProduct.image}
                alt={formattedProduct.name}
                width={700}
                height={700}
                priority
                className="h-auto max-h-[430px] w-full bg-white object-contain"
              />
            </div>
          </div>

          {/* Product Information */}
          <div className="lg:col-span-4">

            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
              {formattedProduct.category}
            </p>

            <h1 className="text-2xl font-bold leading-snug tracking-tight sm:text-3xl">
              {formattedProduct.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-md bg-yellow-50 px-3 py-2 font-semibold text-yellow-800">
                ★ {formattedProduct.rating.toFixed(1)} / 5
              </span>

              <span
                className={
                  formattedProduct.inStock
                    ? "font-medium text-green-700"
                    : "font-medium text-red-600"
                }
              >
                {formattedProduct.inStock
                  ? "In Stock"
                  : "Out of Stock"}
              </span>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-5">
              <h2 className="mb-2 text-sm font-semibold text-gray-900">
                Product Description
              </h2>

              <p className="text-sm leading-7 text-gray-600">
                {formattedProduct.description}
              </p>
            </div>

            <div className="mt-5 border-t border-gray-200 pt-5">
              <p className="text-sm text-gray-600">
                Brand:{" "}
                <span className="font-semibold text-gray-900">
                  {formattedProduct.brand}
                </span>
              </p>
            </div>

          </div>

          {/* Purchase Section */}
          <div className="lg:col-span-3">
            <div className="rounded-xl border border-gray-200 p-5 shadow-sm">

              <p className="text-sm text-gray-500">
                Price
              </p>

              <p className="mt-1 text-3xl font-bold text-gray-900">
                ${formattedProduct.price.toFixed(2)}
              </p>

              <p
                className={`mt-4 text-sm font-medium ${
                  formattedProduct.inStock
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {formattedProduct.inStock
                  ? "Available for purchase"
                  : "Currently unavailable"}
              </p>

              <div className="mt-6 flex flex-row gap-3">
                <AddToCartButton product={formattedProduct} />

                <WishlistButton product={formattedProduct} />
              </div>

              <p className="mt-5 text-xs leading-5 text-gray-500">
                Demo store — no real purchases or payments are processed.
              </p>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
