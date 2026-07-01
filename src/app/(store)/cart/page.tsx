"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } =
    useCart();

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <ShoppingBag className="mx-auto h-12 w-12 text-zinc-300 dark:text-zinc-700" />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Your cart is empty
        </h1>
        <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
          Looks like you haven&apos;t added anything to your cart yet. Browse our
          collection and find something you love.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Start Shopping
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const shipping = cartTotal >= 999 ? 0 : 99;
  const finalTotal = cartTotal + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Shopping Cart
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <Link
          href="/shop"
          className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 sm:gap-6 sm:p-6"
              >
                {/* Item Image */}
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800 sm:h-28 sm:w-28">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-300 dark:text-zinc-600">
                      <ShoppingBag className="h-8 w-8" />
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 sm:text-base">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-50">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                      {item.isWholesale && (
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center rounded bg-amber-50 px-1.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
                            Wholesale (MOQ: {item.moq})
                          </span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="shrink-0 rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-0 rounded-lg border border-zinc-200 dark:border-zinc-700">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={!!(item.isWholesale && item.moq && item.quantity <= item.moq)}
                        className="p-2 text-zinc-500 transition-colors hover:text-zinc-900 disabled:opacity-30 dark:text-zinc-400 dark:hover:text-zinc-50"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-10 text-center text-xs font-semibold text-zinc-900 dark:text-zinc-50">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.min(item.quantity + 1, item.stock)
                          )
                        }
                        className="p-2 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              Order Summary
            </h2>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Subtotal ({cartCount} items)
                </span>
                <span className="font-medium text-zinc-900 dark:text-zinc-50">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Shipping
                </span>
                <span
                  className={`font-medium ${
                    shipping === 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-zinc-900 dark:text-zinc-50"
                  }`}
                >
                  {shipping === 0
                    ? "Free"
                    : `₹${shipping.toLocaleString("en-IN")}`}
                </span>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-zinc-400 dark:text-zinc-500">
                  Add ₹{(999 - cartTotal).toLocaleString("en-IN")} more for free
                  shipping
                </p>
              )}

              <div className="border-t border-zinc-100 pt-3 dark:border-zinc-800">
                <div className="flex justify-between">
                  <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                    Total
                  </span>
                  <span className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                    ₹{finalTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-zinc-900/20 transition-all hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-zinc-50/10 dark:hover:bg-zinc-200"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>

            <p className="mt-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
              Taxes calculated at checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
