"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
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
  const searchParams = useSearchParams();
  const colorParam = searchParams.get("color");

  const activeColorIdx = colors.findIndex((c) => c.name === colorParam);
  const resolvedIdx = activeColorIdx !== -1 ? activeColorIdx : 0;
  
  const activeImages = colors.length > 0 && colors[resolvedIdx]?.images?.length > 0 
    ? colors[resolvedIdx].images 
    : initialImages;

  const [thumbIdx, setThumbIdx] = useState(0);

  useEffect(() => {
    setThumbIdx(0);
  }, [colorParam]);

  const mainImage = activeImages[thumbIdx] || "";

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={productName}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
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

      {/* Thumbnail strip */}
      {activeImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {activeImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setThumbIdx(i)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all
                ${thumbIdx === i ? "border-zinc-900 dark:border-zinc-50" : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600"}`}
            >
              <Image
                src={img}
                alt={`${productName} view ${i + 1}`}
                fill
                sizes="(max-width: 768px) 25vw, 15vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
