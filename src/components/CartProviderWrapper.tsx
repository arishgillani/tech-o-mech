"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

export default function CartProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <WishlistProvider>
      <CartProvider>{children}</CartProvider>
    </WishlistProvider>
  );
}