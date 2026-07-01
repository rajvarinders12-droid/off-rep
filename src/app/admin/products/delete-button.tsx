"use client";

import React, { useTransition } from "react";
import { deleteProduct } from "./actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function DeleteProductButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this product?")) {
      startTransition(async () => {
        const result = await deleteProduct(id);
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
