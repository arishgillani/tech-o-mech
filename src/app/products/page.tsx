
import { Suspense } from "react";
import ProductsContent from "./ProductsContent";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-white px-6 py-12 sm:px-8 lg:px-12">
          <p className="text-gray-600">Loading products...</p>
        </main>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
