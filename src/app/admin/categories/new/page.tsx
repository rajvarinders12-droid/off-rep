import React from "react";
import CategoryForm from "./category-form";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Category</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Create a new product category for your store
        </p>
      </div>
      <CategoryForm />
    </div>
  );
}
