"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react";

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
  const urlColorParam = searchParams.get("color");
  const [clientColorParam, setClientColorParam] = useState<string | null>(urlColorParam);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const handleColorChange = (e: CustomEvent<string>) => {
      setClientColorParam(e.detail);
      setThumbIdx(0);
    };
    
    window.addEventListener('productColorChange', handleColorChange as EventListener);
    return () => {
      window.removeEventListener('productColorChange', handleColorChange as EventListener);
    };
  }, []);

  const activeColorIdx = colors.findIndex((c) => c.name === clientColorParam);
  const resolvedIdx = activeColorIdx !== -1 ? activeColorIdx : 0;
  
  const activeImages = colors.length > 0 && colors[resolvedIdx]?.images?.length > 0 
    ? colors[resolvedIdx].images 
    : initialImages;

  const [thumbIdx, setThumbIdx] = useState(0);

  useEffect(() => {
    setThumbIdx(0);
  }, [clientColorParam]);

  const mainImage = activeImages[thumbIdx] || "";

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setThumbIdx((prev) => (prev === 0 ? activeImages.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setThumbIdx((prev) => (prev === activeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Preload first image of all color variants so they load instantly when clicked */}
      <div className="hidden">
        {colors.map((c) => c.images?.[0] && (
           <Image key={c.name} src={c.images[0]} alt="preload" priority width={10} height={10} />
        ))}
      </div>

      {/* Main Image */}
      <div 
        className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 cursor-zoom-in"
        onClick={() => mainImage && setLightboxOpen(true)}
      >
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

      {/* Lightbox Overlay */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm">
          {/* Top Bar */}
          <div className="absolute top-0 right-0 z-10 flex w-full justify-end p-4">
            <button
              onClick={() => setLightboxOpen(false)}
              className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Main Gallery Area */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden">
            {activeImages.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors md:left-8"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            <div className="relative h-full w-full max-w-5xl max-h-[85vh]">
              <Image
                src={activeImages[thumbIdx]}
                alt={`${productName} gallery view`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {activeImages.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors md:right-8"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Thumbnails in Lightbox */}
          {activeImages.length > 1 && (
            <div className="flex h-24 w-full justify-center gap-2 overflow-x-auto p-4 pb-6">
              {activeImages.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setThumbIdx(i); }}
                  className={`relative h-full w-16 shrink-0 overflow-hidden rounded-md transition-all ${
                    thumbIdx === i ? "ring-2 ring-white" : "opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
