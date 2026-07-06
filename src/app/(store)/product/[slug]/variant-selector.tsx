"use client";

import { useState } from "react";

interface ColorVariant {
  name: string;
  hex: string;
  images: string[];
}

interface VariantSelectorProps {
  colors: ColorVariant[];
  sizes: string[];
  sizeChartUrl?: string | null;
  onColorChange?: (images: string[]) => void;
}

export default function VariantSelector({
  colors,
  sizes,
  sizeChartUrl,
  onColorChange,
}: VariantSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<number | null>(colors.length > 0 ? 0 : null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeChart, setShowSizeChart] = useState(false);

  const handleColorSelect = (idx: number) => {
    setSelectedColor(idx);
    if (onColorChange && colors[idx]) {
      onColorChange(colors[idx].images);
    }
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
            {selectedColor !== null && (
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {colors[selectedColor].name}
                <span className="ml-2 font-mono text-xs text-zinc-400">{colors[selectedColor].hex}</span>
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {colors.map((color, idx) => (
              <button
                key={idx}
                type="button"
                title={color.name}
                onClick={() => handleColorSelect(idx)}
                className={`group relative flex items-center gap-2 rounded-full border-2 px-3 py-1.5 transition-all
                  ${selectedColor === idx
                    ? "border-zinc-900 dark:border-zinc-50 shadow-md"
                    : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
                  }`}
              >
                <span
                  className="h-5 w-5 rounded-full border border-zinc-200 dark:border-zinc-600 shrink-0"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{color.name}</span>
                {selectedColor === idx && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-zinc-900 dark:bg-zinc-50 border-2 border-white dark:border-zinc-950" />
                )}
              </button>
            ))}
          </div>

          {/* Per-color thumbnails */}
          {selectedColor !== null && colors[selectedColor].images.length > 1 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {colors[selectedColor].images.map((img, i) => (
                <div key={i} className="h-14 w-14 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="h-full w-full object-cover" />
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
                onClick={() => setSelectedSize(selectedSize === size ? null : size)}
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

          {/* Size Chart */}
          {showSizeChart && sizeChartUrl && (
            <div className="mt-3 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sizeChartUrl} alt="Size chart" className="w-full object-contain" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
