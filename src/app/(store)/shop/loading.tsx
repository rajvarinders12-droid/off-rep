import React from "react";
import { Sparkles } from "lucide-react";

export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1 space-y-3">
          <div className="h-3 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-8 w-64 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
          
          <div className="mt-6 flex max-w-md gap-2">
            <div className="h-9 flex-1 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-9 w-24 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </div>

      {/* Category Filters Skeleton */}
      <div className="mt-8 flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
        ))}
      </div>

      {/* Product Grid Skeleton */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="aspect-square w-full animate-pulse bg-zinc-200 dark:bg-zinc-800" />
            <div className="p-4 space-y-3">
              <div className="h-3 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-5 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800 pt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
