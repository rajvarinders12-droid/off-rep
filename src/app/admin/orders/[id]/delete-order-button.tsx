"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteOrder } from "../actions";

export default function DeleteOrderButton({ orderId }: { orderId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      setIsDeleting(true);
      await deleteOrder(orderId);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center gap-2 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 disabled:opacity-50 print:hidden"
    >
      <Trash2 className="h-4 w-4" />
      {isDeleting ? "Deleting..." : "Delete Order"}
    </button>
  );
}
