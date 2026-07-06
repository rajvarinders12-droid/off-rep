"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { ShoppingBag, Minus, Plus, Check, Info } from "lucide-react";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    wholesalePrice: number | null;
    moq: number | null;
    images: string[];
    stock: number;
  };
  selectedColor?: { name: string; hex: string } | null;
  selectedSize?: string | null;
}

export default function AddToCartButton({ product, selectedColor, selectedSize }: AddToCartButtonProps) {
  const { addToCart, cart } = useCart();
  const [isWholesale, setIsWholesale] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const hasWholesale = product.wholesalePrice !== null && product.wholesalePrice > 0;
  const currentMoq = isWholesale ? (product.moq || 1) : 1;
  const currentPrice = isWholesale && product.wholesalePrice ? product.wholesalePrice : product.price;

  // Sync quantity with MOQ when toggle changes
  useEffect(() => {
    if (isWholesale && product.moq) {
      if (quantity < product.moq) {
        setQuantity(product.moq);
      }
    } else {
      setQuantity(1);
    }
  }, [isWholesale, product.moq]);

  const existingItem = cart.find((item) => item.id === (isWholesale ? `${product.id}-wholesale` : product.id));
  const maxQty = product.stock - (existingItem?.quantity || 0);

  const handleAddToCart = () => {
    if (product.stock <= 0 || maxQty <= 0) return;
    
    // Final check for wholesale MOQ requirements
    if (isWholesale && product.moq && quantity < product.moq) {
      alert(`Minimum order quantity for wholesale is ${product.moq} pcs.`);
      return;
    }

    addToCart(
      {
        id: product.id,
        name: product.name,
        price: currentPrice,
        images: product.images,
        stock: product.stock,
        isWholesale,
        moq: currentMoq,
        selectedColor: selectedColor || null,
        selectedSize: selectedSize || null,
      },
      quantity
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    setQuantity(currentMoq);
  };

  if (product.stock <= 0) {
    return (
      <button
        disabled
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-100 px-6 py-4 text-sm font-semibold text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wholesaler / Retail Toggle */}
      {hasWholesale && (
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-550 dark:text-zinc-400">
            Select Purchase Option
          </span>
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setIsWholesale(false)}
              className={`rounded-lg py-2.5 text-xs font-semibold transition-all ${
                !isWholesale
                  ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              Retail (1+ pcs)
            </button>
            <button
              type="button"
              onClick={() => setIsWholesale(true)}
              className={`rounded-lg py-2.5 text-xs font-semibold transition-all ${
                isWholesale
                  ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              Wholesale ({product.moq}+ pcs)
            </button>
          </div>

          {/* Wholesale Info Box */}
          {isWholesale && (
            <div className="flex items-start gap-2.5 rounded-xl bg-amber-50/50 p-3 text-xs text-amber-805 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-100/50 dark:border-amber-900/30">
              <Info className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-500" />
              <div>
                <p className="font-semibold">Wholesale Pricing Active</p>
                <p className="mt-0.5 opacity-90">
                  Price reduced to <strong className="font-bold">₹{product.wholesalePrice?.toLocaleString("en-IN")} per piece</strong>.
                  Requires a minimum order of <strong className="font-bold">{product.moq} pieces</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dynamic Price Display */}
      {hasWholesale && (
        <div className="flex flex-col gap-0.5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <span className="text-xs text-zinc-500">Unit Price</span>
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            ₹{currentPrice.toLocaleString("en-IN")}
          </span>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
          Quantity
        </span>
        <div className="flex items-center gap-0 rounded-lg border border-zinc-200 dark:border-zinc-700">
          <button
            onClick={() => setQuantity((q) => Math.max(currentMoq, q - 1))}
            disabled={quantity <= currentMoq}
            className="p-2.5 text-zinc-500 transition-colors hover:text-zinc-900 disabled:opacity-30 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="w-12 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {quantity}
          </span>
          <button
            onClick={() =>
              setQuantity((q) => Math.min(maxQty, q + 1))
            }
            className="p-2.5 text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        {maxQty <= 5 && maxQty > 0 && (
          <span className="text-xs text-amber-600 dark:text-amber-400">
            Max {maxQty} more available
          </span>
        )}
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={maxQty <= 0 || !!(isWholesale && product.moq && quantity < product.moq)}
        className={`flex w-full items-center justify-center gap-2.5 rounded-xl px-6 py-4 text-sm font-semibold transition-all ${
          added
            ? "bg-emerald-600 text-white"
            : maxQty <= 0
            ? "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
            : "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:shadow-zinc-50/10 dark:hover:bg-zinc-200"
        }`}
      >
        {added ? (
          <>
            <Check className="h-4 w-4" />
            Added to Cart!
          </>
        ) : maxQty <= 0 ? (
          "Maximum quantity in cart"
        ) : (
          <>
            <ShoppingBag className="h-4 w-4" />
            Add to Cart — ₹{(currentPrice * quantity).toLocaleString("en-IN")}
          </>
        )}
      </button>
    </div>
  );
}
