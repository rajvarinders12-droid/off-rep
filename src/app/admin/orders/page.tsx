import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import StatusSelect from "./status-select";
import CouponFilter from "./coupon-filter";
import { Receipt, Package, Ticket } from "lucide-react";

export const revalidate = 0; // Real-time order tracking

export default async function AdminOrdersPage(props: {
  searchParams: Promise<{ coupon?: string }>;
}) {
  const searchParams = await props.searchParams;
  const couponFilter = searchParams?.coupon;

  const whereClause = couponFilter && couponFilter !== "all" 
    ? { couponId: couponFilter } 
    : {};

  const [orders, coupons] = await Promise.all([
    db.order.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    }),
    db.coupon.findMany({
      select: { id: true, code: true },
      orderBy: { createdAt: "desc" },
    })
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-2">
          <p className="text-zinc-500 dark:text-zinc-400">
            Monitor customer checkouts, payments, and update delivery fulfillment status
          </p>
          <CouponFilter coupons={coupons} currentCoupon={couponFilter} />
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {orders.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center space-y-3 text-zinc-500 dark:text-zinc-400">
            <Receipt className="h-12 w-12 text-zinc-300 dark:text-zinc-700" />
            <div className="text-lg font-medium">No orders found</div>
            <p className="text-sm text-center max-w-xs">
              Orders will appear here as soon as customers complete a checkout flow.
            </p>
          </div>
        ) : (
          <div className="relative w-full overflow-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Customer</th>
                  <th className="p-4 font-semibold">Products Purchase</th>
                  <th className="p-4 font-semibold">Total Amount</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold text-right">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="text-zinc-900 hover:bg-zinc-50/50 dark:text-zinc-100 dark:hover:bg-zinc-800/30"
                  >
                    <td className="p-4 font-medium font-mono text-xs max-w-[120px] truncate">
                      {order.id}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold">{order.user.fullName || "Guest Customer"}</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{order.user.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {order.orderItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-1.5 text-xs">
                            <span className="font-medium font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded text-zinc-700 dark:text-zinc-300">
                              x{item.quantity}
                            </span>
                            <span className="truncate max-w-[200px] block">
                              {item.product?.name || "Deleted Product"}
                            </span>
                          </div>
                        ))}
                      </div>
                      {order.couponId && (
                        <div className="mt-2 inline-flex items-center gap-1 rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                          <Ticket className="h-3 w-3" />
                          Coupon Applied
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-semibold">
                      ₹{Number(order.totalPrice).toFixed(2)}
                    </td>
                    <td className="p-4 text-zinc-500 dark:text-zinc-400">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <StatusSelect orderId={order.id} currentStatus={order.status} />
                        <Link 
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium shadow-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
