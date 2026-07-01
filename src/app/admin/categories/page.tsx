import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { Plus, FolderTree } from "lucide-react";
import DeleteCategoryButton from "./delete-button";

export const revalidate = 0; // Disable cache so updates are immediate

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage your store product categories to help customers navigate listings
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg px-2.5 h-8 text-sm font-medium bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Link>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {categories.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center space-y-3 text-zinc-500 dark:text-zinc-400">
            <FolderTree className="h-12 w-12 text-zinc-300 dark:text-zinc-700" />
            <div className="text-lg font-medium">No categories found</div>
            <p className="text-sm">Get started by creating your first category.</p>
          </div>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                  <th className="p-4 font-semibold">Image</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Slug</th>
                  <th className="p-4 font-semibold">Description</th>
                  <th className="p-4 font-semibold">Products</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="text-zinc-900 hover:bg-zinc-50/50 dark:text-zinc-100 dark:hover:bg-zinc-800/30"
                  >
                    <td className="p-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded-md border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                        {category.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-zinc-450 dark:text-zinc-550">
                            <FolderTree className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium max-w-xs truncate">
                      {category.name}
                    </td>
                    <td className="p-4 font-mono text-xs">
                      {category.slug}
                    </td>
                    <td className="p-4 max-w-xs truncate text-zinc-500 dark:text-zinc-400">
                      {category.description || "—"}
                    </td>
                    <td className="p-4">
                      <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                        {category._count.products} products
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <DeleteCategoryButton id={category.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
