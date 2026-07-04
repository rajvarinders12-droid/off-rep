import { CouponForm } from "./coupon-form";

export default function NewCouponPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Create Coupon</h1>
      </div>

      <div className="rounded-md border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <CouponForm />
      </div>
    </div>
  );
}
