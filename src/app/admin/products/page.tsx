import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { Plus, Edit, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteProductButton from "./delete-button";
import Image from "next/image";

export const revalidate = 0; // Disable cache so product updates are immediate

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage your store inventory, pricing, and active listings
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg px-2.5 h-8 text-sm font-medium bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {products.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center space-y-3 text-zinc-500 dark:text-zinc-400">
            <Package className="h-12 w-12 text-zinc-300 dark:text-zinc-700" />
            <div className="text-lg font-medium">No products found</div>
            <p className="text-sm">Get started by creating your first product listing.</p>
          </div>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                  <th className="p-4 font-semibold">Image</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold">Featured</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="text-zinc-900 hover:bg-zinc-50/50 dark:text-zinc-100 dark:hover:bg-zinc-800/30"
                  >
                    <td className="p-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded-md border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                        {product.images.length > 0 ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-zinc-450 dark:text-zinc-550">
                            <Package className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium max-w-xs truncate">
                      {product.name}
                    </td>
                    <td className="p-4 capitalize">
                      {product.category.name}
                    </td>
                    <td className="p-4 font-semibold">
                      ₹{Number(product.price).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          product.stock > 10
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : product.stock > 0
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                            : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                        }`}
                      >
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="p-4">
                      {product.isFeatured ? (
                        <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                          Yes
                        </span>
                      ) : (
                        <span className="text-zinc-400 dark:text-zinc-650 text-xs">No</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/${product.slug}`}
                          target="_blank"
                          className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                        >
                          Edit
                        </Link>
                        <DeleteProductButton id={product.id} />
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
