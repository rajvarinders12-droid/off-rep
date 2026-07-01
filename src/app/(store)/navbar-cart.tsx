"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { ShoppingCart } from "lucide-react";

export default function NavbarCart() {
  const { cartCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative rounded-full p-2.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
    >
      <ShoppingCart className="h-5 w-5" />
      {cartCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-[10px] font-bold text-white dark:bg-white dark:text-zinc-950">
          {cartCount}
        </span>
      )}
    </Link>
  );
}
