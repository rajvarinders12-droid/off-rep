"use client";

import React, { useTransition } from "react";
import { deleteCategory } from "./actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function DeleteCategoryButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this category? Warning: Deleting a category will also delete all products in this category!")) {
      startTransition(async () => {
        const result = await deleteCategory(id);
        if (result?.error) {
          alert(result.error);
        }
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={isPending}
      onClick={handleDelete}
      className="text-red-650 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
