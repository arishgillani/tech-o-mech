
import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://tech-o-mech.vercel.app";

  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("slug");

  if (error) {
    console.error("Error fetching products for sitemap:", error);
  }

  const productUrls: MetadataRoute.Sitemap = (products ?? [])
    .filter((product) => product.slug)
    .map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  return [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...productUrls,
  ];
}
