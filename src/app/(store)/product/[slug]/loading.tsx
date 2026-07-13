import React from "react";

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Breadcrumb Skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="h-4 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Product Content Skeleton */}
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Images Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square w-full animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex gap-2">
              <div className="h-8 w-16 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-8 w-16 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square w-full animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="flex flex-col py-2 space-y-6">
            <div className="space-y-3">
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-10 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-8 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>

            <div className="h-24 w-full animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />

            <div className="space-y-4 pt-8">
              <div className="h-12 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-16 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
