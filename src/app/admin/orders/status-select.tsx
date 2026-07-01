"use client";

import React, { useTransition } from "react";
import { updateOrderStatus } from "./actions";
import { OrderStatus } from "@prisma/client";

export default function StatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus;
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result?.error) {
        alert(result.error);
      }
    });
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className={`rounded-md border border-zinc-200 px-2 py-1 text-xs font-semibold shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:border-zinc-800 disabled:opacity-50 ${
        currentStatus === "paid"
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
          : currentStatus === "pending"
          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
          : currentStatus === "shipped"
          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
          : currentStatus === "delivered"
          ? "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
          : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
      }`}
    >
      <option value="pending">Pending</option>
      <option value="paid">Paid</option>
      <option value="shipped">Shipped</option>
      <option value="delivered">Delivered</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}
