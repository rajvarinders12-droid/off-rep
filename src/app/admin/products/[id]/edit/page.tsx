import React from "react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductForm from "../../new/product-form";

export const revalidate = 0;

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await db.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const productData = {
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    wholesalePrice: product.wholesalePrice ? Number(product.wholesalePrice) : null,
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Make changes to your product listing below.
        </p>
      </div>

      <ProductForm categories={categories} initialData={productData} />
    </div>
  );
}
