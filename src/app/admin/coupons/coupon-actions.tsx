"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Power } from "lucide-react";
import { toggleCouponStatus, deleteCoupon } from "./actions";

export function CouponActions({ id, isActive }: { id: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex gap-2 justify-end">
      <Button
        variant={isActive ? "default" : "secondary"}
        size="sm"
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            toggleCouponStatus(id, !isActive);
          });
        }}
      >
        <Power className="mr-2 h-4 w-4" />
        {isActive ? "Active" : "Inactive"}
      </Button>
      <Button
        variant="destructive"
        size="sm"
        disabled={isPending}
        onClick={() => {
          if (confirm("Are you sure you want to delete this coupon?")) {
            startTransition(() => {
              deleteCoupon(id);
            });
          }
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
