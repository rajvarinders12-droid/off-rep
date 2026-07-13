"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const colorParam = searchParams.get("color");

  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(() => {
    if (colors.length === 0) return null;
    if (colorParam) {
      const match = colors.find((c) => c.name === colorParam);
      if (match) return { name: match.name, hex: match.hex };
    }
    return { name: colors[0].name, hex: colors[0].hex };
  });

  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Keep state in sync if URL changes (e.g., from going back)
  useEffect(() => {
    if (colorParam && colors.length > 0) {
      const match = colors.find((c) => c.name === colorParam);
      if (match && selectedColor?.name !== match.name) {
        setSelectedColor({ name: match.name, hex: match.hex });
      }
    }
  }, [colorParam, colors, selectedColor?.name]);

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
          product={{
            ...product,
            images: colors.find((c) => c.name === selectedColor?.name)?.images?.length 
              ? colors.find((c) => c.name === selectedColor?.name)!.images 
              : product.images,
          }}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
        />
      </div>
    </div>
  );
}
