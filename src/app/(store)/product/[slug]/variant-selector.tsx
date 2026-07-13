"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

interface ColorVariant {
  name: string;
  hex: string;
  images: string[];
}

interface VariantSelectorProps {
  colors: ColorVariant[];
  sizes: string[];
  sizeChartUrl?: string | null;
  // Controlled state from parent (variant-add-to-cart.tsx)
  selectedColor?: { name: string; hex: string } | null;
  selectedSize?: string | null;
  onColorChange?: (color: { name: string; hex: string } | null) => void;
  onSizeChange?: (size: string | null) => void;
}

export default function VariantSelector({
  colors,
  sizes,
  sizeChartUrl,
  selectedColor,
  selectedSize,
  onColorChange,
  onSizeChange,
}: VariantSelectorProps) {
  const [showSizeChart, setShowSizeChart] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Find active color index
  const activeColorIdx = selectedColor
    ? colors.findIndex((c) => c.name === selectedColor.name && c.hex === selectedColor.hex)
    : -1;

  const handleColorClick = (idx: number) => {
    const color = colors[idx];
    onColorChange?.({ name: color.name, hex: color.hex });
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set("color", color.name);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleSizeClick = (size: string) => {
    onSizeChange?.(selectedSize === size ? null : size);
  };

  if (colors.length === 0 && sizes.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Color Selector */}
      {colors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-900 dark:text-zinc-50">
              Colour
            </h3>
            {selectedColor && (
              <span className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
                <span
                  className="h-3.5 w-3.5 rounded-full border border-zinc-300"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                {selectedColor.name}
                <span className="font-mono text-xs text-zinc-400">{selectedColor.hex}</span>
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {colors.map((color, idx) => (
              <button
                key={idx}
                type="button"
                title={color.name}
                onClick={() => handleColorClick(idx)}
                className={`group relative flex items-center gap-2 rounded-full border-2 px-3 py-1.5 transition-all
                  ${activeColorIdx === idx
                    ? "border-zinc-900 dark:border-zinc-50 shadow-md"
                    : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
                  }`}
              >
                <span
                  className="h-5 w-5 rounded-full border border-zinc-200 dark:border-zinc-600 shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{color.name}</span>
                {activeColorIdx === idx && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-zinc-900 dark:bg-zinc-50 border-2 border-white dark:border-zinc-950" />
                )}
              </button>
            ))}
          </div>

          {/* Per-color thumbnails */}
          {activeColorIdx >= 0 && colors[activeColorIdx].images.length > 1 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {colors[activeColorIdx].images.map((img, i) => (
                <div key={i} className="relative h-14 w-14 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Size Selector */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-900 dark:text-zinc-50">
              Size
            </h3>
            {sizeChartUrl && (
              <button
                type="button"
                onClick={() => setShowSizeChart((p) => !p)}
                className="text-xs font-medium text-zinc-500 underline hover:text-zinc-900 dark:hover:text-zinc-50"
              >
                {showSizeChart ? "Hide" : "View"} Size Chart
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeClick(size)}
                className={`rounded-md border px-4 py-2 text-sm font-medium transition-all
                  ${selectedSize === size
                    ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                    : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-500"
                  }`}
              >
                {size}
              </button>
            ))}
          </div>

          {showSizeChart && sizeChartUrl && (
            <div className="relative mt-3 h-64 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              <Image
                src={sizeChartUrl}
                alt="Size chart"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
