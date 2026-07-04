import { db } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CouponActions } from "./coupon-actions";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function CouponsPage() {
  const coupons = await db.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
        <Link href="/admin/coupons/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Coupon
          </Button>
        </Link>
      </div>

      <div className="rounded-md border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b border-zinc-200 dark:border-zinc-800">
              <tr className="border-b border-zinc-200 transition-colors hover:bg-zinc-100/50 dark:border-zinc-800 dark:hover:bg-zinc-800/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-zinc-500 dark:text-zinc-400">Code</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-zinc-500 dark:text-zinc-400">Discount</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-zinc-500 dark:text-zinc-400">Applicable for</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-zinc-500 dark:text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {coupons.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="border-b border-zinc-200 transition-colors hover:bg-zinc-100/50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                >
                  <td className="p-4 align-middle font-medium">{coupon.code}</td>
                  <td className="p-4 align-middle">
                    {coupon.discountType === "fixed"
                      ? `₹${coupon.discountValue.toString()}`
                      : `${coupon.discountValue.toString()}%`}
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex gap-2">
                      {coupon.isForRetail && (
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">Retail</span>
                      )}
                      {coupon.isForWholesale && (
                        <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800">Wholesale</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 align-middle text-right">
                    <CouponActions id={coupon.id} isActive={coupon.isActive} />
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-zinc-500">
                    No coupons found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
