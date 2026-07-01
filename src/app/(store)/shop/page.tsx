import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { Sparkles, SlidersHorizontal } from "lucide-react";

export const revalidate = 0;

export const metadata = {
  title: "Shop All Products — OFF-REP",
  description: "Browse our complete collection of premium products.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const products = await db.product.findMany({
    where: category
      ? { category: { slug: category }, stock: { gt: 0 } }
      : { stock: { gt: 0 } },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            {activeCategory ? activeCategory.name : "All Products"}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            {activeCategory
              ? `${activeCategory.name} Collection`
              : "Shop All Products"}
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {products.length} {products.length === 1 ? "product" : "products"}{" "}
            available
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/shop"
          className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
            !category
              ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
              : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-50"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              category === cat.slug
                ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-50"
            }`}
          >
            {cat.name} ({cat._count.products})
          </Link>
        ))}
      </div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:border-zinc-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {product.images.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-300 dark:text-zinc-600">
                    <Sparkles className="h-10 w-10" />
                  </div>
                )}
                {product.isFeatured && (
                  <div className="absolute left-3 top-3 rounded-full bg-zinc-900/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm dark:bg-white/80 dark:text-zinc-900">
                    Featured
                  </div>
                )}
                {product.stock <= 5 && product.stock > 0 && (
                  <div className="absolute right-3 top-3 rounded-full bg-amber-500/90 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                    Only {product.stock} left
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  {product.category.name}
                </p>
                <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {product.description}
                  </p>
                )}
                <p className="mt-3 text-base font-bold text-zinc-900 dark:text-zinc-50">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-20 flex flex-col items-center justify-center text-center">
          <Sparkles className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
          <p className="mt-4 text-lg font-medium text-zinc-500 dark:text-zinc-400">
            No products found
          </p>
          <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
            {category
              ? "No products in this category yet. Try another filter."
              : "Products will appear here once the admin adds them."}
          </p>
          {category && (
            <Link
              href="/shop"
              className="mt-6 rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              View All Products
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
