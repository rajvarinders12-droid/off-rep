import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { ArrowRight, Sparkles } from "lucide-react";

export const revalidate = 0;

export const metadata = {
  title: "Categories — OFF-REP",
  description: "Browse all product categories.",
};

export default async function CategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { products: true } },
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Explore
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          All Categories
        </h1>
      </div>

      {categories.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:border-zinc-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              {category.imageUrl && (
                <div className="absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={category.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="relative">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {category.description}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-zinc-400 dark:text-zinc-500">
                    {category._count.products}{" "}
                    {category._count.products === 1 ? "product" : "products"}
                  </span>
                  <ArrowRight className="h-4 w-4 text-zinc-300 transition-all group-hover:translate-x-1 group-hover:text-zinc-600 dark:text-zinc-700 dark:group-hover:text-zinc-400" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-20 flex flex-col items-center justify-center text-center">
          <Sparkles className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
          <p className="mt-4 text-lg font-medium text-zinc-500 dark:text-zinc-400">
            No categories yet
          </p>
          <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
            Categories will appear here once the admin creates them.
          </p>
        </div>
      )}
    </div>
  );
}
