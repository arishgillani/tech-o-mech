import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Supabase products error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }

  const products = data.map((product) => ({
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
  }));

  return NextResponse.json({
    success: true,
    count: products.length,
    products,
  });
}