"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

interface ColorVariant {
  name: string;
  hex: string;
  images: string[];
}

interface ProductGalleryProps {
  initialImages: string[];
  colors: ColorVariant[];
  productName: string;
  isFeatured: boolean;
}

export default function ProductGallery({
  initialImages,
  colors,
  productName,
  isFeatured,
}: ProductGalleryProps) {
  const [activeImages, setActiveImages] = useState<string[]>(initialImages);
  const [activeColor, setActiveColor] = useState<number | null>(colors.length > 0 ? 0 : null);
  const [mainImage, setMainImage] = useState<string>(initialImages[0] || "");

  const handleColorSelect = (idx: number) => {
    setActiveColor(idx);
    const colorImages = colors[idx]?.images ?? [];
    setActiveImages(colorImages.length > 0 ? colorImages : initialImages);
    setMainImage(colorImages[0] || initialImages[0] || "");
  };

  // Keep main image in sync when activeImages changes
  const handleThumbClick = (img: string) => setMainImage(img);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        {mainImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mainImage} alt={productName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-300 dark:text-zinc-700">
            <Sparkles className="h-16 w-16" />
          </div>
        )}
        {isFeatured && (
          <div className="absolute left-4 top-4 rounded-full bg-zinc-900/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm dark:bg-white/80 dark:text-zinc-900">
            Featured
          </div>
        )}
      </div>

      {/* Color swatches (mini, clickable) */}
      {colors.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {colors.map((color, idx) => (
            <button
              key={idx}
              type="button"
              title={color.name}
              onClick={() => handleColorSelect(idx)}
              className={`flex items-center gap-1.5 rounded-full border-2 px-2.5 py-1 text-xs font-medium transition-all
                ${activeColor === idx
                  ? "border-zinc-900 dark:border-zinc-50 shadow"
                  : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
                }`}
            >
              <span
                className="h-4 w-4 rounded-full border border-zinc-200 dark:border-zinc-600 shrink-0"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-zinc-700 dark:text-zinc-300">{color.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Thumbnail strip */}
      {activeImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {activeImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleThumbClick(img)}
              className={`aspect-square overflow-hidden rounded-lg border-2 transition-all
                ${mainImage === img ? "border-zinc-900 dark:border-zinc-50" : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={`${productName} view ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
