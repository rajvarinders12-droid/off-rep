"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ticket } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
}

interface CouponFilterProps {
  coupons: Coupon[];
  currentCoupon?: string;
}

export default function CouponFilter({ coupons, currentCoupon }: CouponFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCouponChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("coupon");
    } else {
      params.set("coupon", value);
    }
    
    // Use replace to avoid building up a huge history stack when filtering
    router.replace(`/admin/orders?${params.toString()}`);
  };

  if (coupons.length === 0) {
    return null; // Don't show filter if no coupons exist
  }

  return (
    <div className="flex items-center gap-2">
      <Ticket className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Filter by Coupon:
      </span>
      <Select
        value={currentCoupon || "all"}
        onValueChange={handleCouponChange}
      >
        <SelectTrigger className="w-[180px] h-9 text-xs border-zinc-200 dark:border-zinc-800">
          <SelectValue placeholder="All Orders" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">
            All Orders
          </SelectItem>
          {coupons.map((coupon) => (
            <SelectItem key={coupon.id} value={coupon.id} className="text-xs">
              {coupon.code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
