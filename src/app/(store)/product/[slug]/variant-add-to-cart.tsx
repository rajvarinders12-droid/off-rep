"use client";

import { useState } from "react";
import AddToCartButton from "./add-to-cart-button";
import VariantSelector from "./variant-selector";

interface ColorVariant {
  name: string;
  hex: string;
  images: string[];
}

interface VariantAddToCartProps {
  product: {
    id: string;
    name: string;
    price: number;
    wholesalePrice: number | null;
    moq: number | null;
    images: string[];
    stock: number;
  };
  colors: ColorVariant[];
  sizes: string[];
  sizeChartUrl?: string | null;
}

export default function VariantAddToCart({
  product,
  colors,
  sizes,
  sizeChartUrl,
}: VariantAddToCartProps) {
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(
    colors.length > 0 ? { name: colors[0].name, hex: colors[0].hex } : null
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Variant selectors */}
      {(colors.length > 0 || sizes.length > 0) && (
        <VariantSelector
          colors={colors}
          sizes={sizes}
          sizeChartUrl={sizeChartUrl}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          onColorChange={(color) => setSelectedColor(color)}
          onSizeChange={(size) => setSelectedSize(size)}
        />
      )}

      {/* Add to Cart */}
      <div className="border-t border-zinc-100 pt-6 dark:border-zinc-800">
        <AddToCartButton
          product={product}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
        />
      </div>
    </div>
  );
}
