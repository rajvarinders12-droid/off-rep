import React from "react";
import { db } from "@/lib/db";
import ProductForm from "./product-form";

export default async function NewProductPage() {
  const categories = await db.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Product</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Create a new product listing in your store inventory
        </p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
