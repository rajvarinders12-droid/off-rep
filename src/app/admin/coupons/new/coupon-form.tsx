"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCoupon } from "../actions";

const initialState = {
  error: "",
};

export function CouponForm() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await createCoupon(formData);
      if (result?.error) {
        return { error: result.error };
      }
      return prevState;
    },
    initialState
  );

  return (
    <form action={formAction} className="space-y-6 max-w-xl">
      {state?.error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
          {state.error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="code">Coupon Code (e.g. SUMMER50)</Label>
        <Input id="code" name="code" required className="uppercase" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="discountType">Discount Type</Label>
          <select
            id="discountType"
            name="discountType"
            className="flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
          >
            <option value="fixed">Fixed Amount (₹)</option>
            <option value="percentage">Percentage (%)</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="discountValue">Discount Value</Label>
          <Input id="discountValue" name="discountValue" type="number" step="0.01" min="0" required />
        </div>
      </div>

      <div className="space-y-4 rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
        <Label className="text-base">Applicable Orders</Label>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isForRetail"
            name="isForRetail"
            defaultChecked
            className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:checked:bg-zinc-50 dark:checked:text-zinc-900 dark:focus:ring-zinc-300"
          />
          <Label htmlFor="isForRetail" className="font-normal cursor-pointer">
            Valid for Retail Orders
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isForWholesale"
            name="isForWholesale"
            className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:checked:bg-zinc-50 dark:checked:text-zinc-900 dark:focus:ring-zinc-300"
          />
          <Label htmlFor="isForWholesale" className="font-normal cursor-pointer">
            Valid for Wholesale Orders
          </Label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Coupon"}
        </Button>
      </div>
    </form>
  );
}
