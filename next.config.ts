
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.84"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lwuavnxursyxyfqjxnqr.supabase.co",
        pathname: "/storage/v1/object/public/product-images/**",
      },
    ],
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
