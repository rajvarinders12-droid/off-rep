import React from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { Sparkles, SlidersHorizontal } from "lucide-react";

export const revalidate = 60;

export const metadata = {
  title: "Shop All Products — OFF-REP",
  description: "Browse our complete collection of premium products.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;

  const whereClause: any = { stock: { gt: 0 } };
  
  if (category) {
    whereClause.category = { slug: category };
  }
  
  if (q) {
    whereClause.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { searchKeywords: { contains: q, mode: "insensitive" } },
    ];
  }

  const products = await db.product.findMany({
    where: whereClause,
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
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            {activeCategory ? activeCategory.name : "All Products"}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            {q 
              ? `Search Results for "${q}"`
              : activeCategory
              ? `${activeCategory.name} Collection`
              : "Shop All Products"}
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {products.length} {products.length === 1 ? "product" : "products"}{" "}
            available
          </p>
          
          <form action="/shop" method="GET" className="mt-6 flex max-w-md gap-2">
            <input 
              type="text" 
              name="q" 
              defaultValue={q || ""}
              placeholder="Search products..." 
              className="flex-1 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500" 
            />
            {category && <input type="hidden" name="category" value={category} />}
            <button type="submit" className="rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href={q ? `/shop?q=${q}` : "/shop"}
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
            href={`/shop?category=${cat.slug}${q ? `&q=${q}` : ""}`}
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
              <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {product.images.length > 0 ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                        product.images.length > 1 ? "group-hover:opacity-0 group-active:opacity-0 group-focus:opacity-0" : "group-hover:scale-105 group-active:scale-105 group-focus:scale-105"
                      }`}
                    />
                    {product.images.length > 1 && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={product.images[1]}
                        alt={`${product.name} alternate view`}
                        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-active:opacity-100 group-focus:opacity-100"
                      />
                    )}
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-300 dark:text-zinc-600">
                    <Sparkles className="h-10 w-10" />
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
                {product.category?.name && (
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    {product.category.name}
                  </p>
                )}
                <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {product.description}
                  </p>
                )}
                <div className="mt-3 flex items-baseline gap-2">
                  <p className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </p>
                  {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
                    <div className="flex items-center gap-2">
                      <del className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                        ₹{Number(product.compareAtPrice).toLocaleString("en-IN")}
                      </del>
                      <span className="rounded-sm bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                        -{Math.round(((Number(product.compareAtPrice) - Number(product.price)) / Number(product.compareAtPrice)) * 100)}%
                      </span>
                    </div>
                  )}
                </div>
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
