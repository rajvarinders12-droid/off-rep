import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { ArrowLeft, Package, Truck, User, MapPin, Receipt, CreditCard } from "lucide-react";
import StatusSelect from "../status-select";
import DownloadPdfButton from "./download-pdf-button";
import InvoiceTemplate from "./invoice-template";
import DeleteOrderButton from "./delete-order-button";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shippingAddress = order.shippingAddress as any;
  const totalPriceNum = Number(order.totalPrice);
  const shippingCost = totalPriceNum >= 999 ? 0 : 99;
  const subtotal = totalPriceNum - shippingCost;

  return (
    <>
      <InvoiceTemplate order={order} />
      <div className="space-y-6 max-w-5xl print:hidden" id="order-details-container">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/orders"
              className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Order #{order.id.slice(0, 8)}...</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Placed on {new Date(order.createdAt).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
          <div className="sm:ml-auto flex flex-wrap items-center gap-3">
            <DeleteOrderButton orderId={order.id} />
            <DownloadPdfButton orderId={order.id} />
            <StatusSelect orderId={order.id} currentStatus={order.status} />
          </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Items & Summary */}
        <div className="md:col-span-2 space-y-6">
          {/* Items */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-zinc-500" />
              Order Items ({order.orderItems.length})
            </h2>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {order.orderItems.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-center">
                  <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-md overflow-hidden flex-shrink-0">
                    {item.product?.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-zinc-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100">{item.product?.name || "Deleted Product"}</p>
                    <p className="text-sm text-zinc-500">₹{Number(item.price).toLocaleString("en-IN")}</p>
                    {/* Variant badges */}
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {(item as any).variantColor && (
                        <span className="inline-flex items-center gap-1 rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          <span
                            className="h-2.5 w-2.5 rounded-full border border-zinc-300 shrink-0"
                            style={{ backgroundColor: (item as any).variantColor.hex }}
                          />
                          {(item as any).variantColor.name}
                        </span>
                      )}
                      {(item as any).variantSize && (
                        <span className="inline-flex items-center rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-xs font-medium text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          Size: {(item as any).variantSize}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">x{item.quantity}</p>
                    <p className="font-semibold mt-1">₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Summary */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Receipt className="h-5 w-5 text-zinc-500" />
              Payment Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Subtotal</span>
                <span className="font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Shipping</span>
                <span className="font-medium">{shippingCost === 0 ? "Free" : `₹${shippingCost}`}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3">
                <span className="font-semibold text-base">Total</span>
                <span className="font-bold text-base">₹{Number(order.totalPrice).toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Shipping */}
        <div className="space-y-6">
          {/* Customer Details */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-zinc-500" />
              Customer
            </h2>
            <div className="space-y-2 text-sm">
              <p className="font-medium">{order.user.fullName || "Guest User"}</p>
              <p className="text-zinc-500">{order.user.email}</p>
              {shippingAddress?.phone && (
                <p className="text-zinc-500">Phone: {shippingAddress.phone}</p>
              )}
            </div>
          </div>

          {/* Shipping Details */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Truck className="h-5 w-5 text-zinc-500" />
              Shipping Address
            </h2>
            {shippingAddress ? (
              <div className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                <p className="font-medium">{shippingAddress.fullName}</p>
                <p>{shippingAddress.addressLine1}</p>
                {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}</p>
              </div>
            ) : (
              <p className="text-sm text-zinc-500 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> No shipping address provided.
              </p>
            )}
          </div>

          {/* Payment Gateway Info */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-zinc-500" />
              Gateway Details
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-zinc-500 block text-xs">Razorpay Order ID</span>
                <span className="font-mono">{order.razorpayOrderId || "N/A"}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-xs">Razorpay Payment ID</span>
                <span className="font-mono">{order.razorpayPaymentId || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
