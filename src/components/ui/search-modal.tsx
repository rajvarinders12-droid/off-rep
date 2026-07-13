"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProductResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  colors: { name: string, hex: string, images: string[] }[];
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (error) {
        console.error("Failed to fetch search results", error);
      } finally {
        setIsLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const getCoverImage = (product: ProductResult) => {
    if (product.colors && product.colors.length > 0 && product.colors[0].images?.length > 0) {
      return product.colors[0].images[0];
    }
    if (product.images?.length > 0) {
      return product.images[0];
    }
    return "/placeholder.png";
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md transition-all duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-0 z-50 flex flex-col transition-all duration-500 ease-in-out ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-end px-4 py-6 sm:px-6 lg:px-8">
          <button
            onClick={onClose}
            className="rounded-full bg-zinc-100 p-3 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            aria-label="Close search"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mx-auto mt-10 w-full max-w-3xl px-4 sm:px-6 flex flex-col items-center">
          <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
            <Search className="absolute left-6 top-1/2 h-6 w-6 -translate-y-1/2 text-zinc-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border-2 border-zinc-200 bg-white py-4 pl-16 pr-8 text-lg font-medium text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-0 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-600 dark:focus:border-zinc-50"
            />
            {isLoading && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2">
                <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
              </div>
            )}
          </form>

          {/* Live Search Results */}
          <div className="w-full max-w-2xl mt-8">
            {query.trim() !== "" && results.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Products ({results.length})
                </h3>
                <div className="flex flex-col gap-3">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={onClose}
                      className="group flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    >
                      <div className="relative h-16 w-16 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getCoverImage(product)}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-50 group-hover:underline">
                          {product.name}
                        </span>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                            ₹{product.price}
                          </span>
                          {product.compareAtPrice && (
                            <span className="text-xs text-zinc-400 line-through">
                              ₹{product.compareAtPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <button
                  onClick={() => {
                    onClose();
                    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
                  }}
                  className="w-full py-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50 hover:underline"
                >
                  View all results for "{query}" &rarr;
                </button>
              </div>
            )}

            {query.trim() !== "" && !isLoading && results.length === 0 && (
              <div className="text-center py-12">
                <p className="text-zinc-500 dark:text-zinc-400">No products found for "{query}".</p>
              </div>
            )}

            {/* Empty State / Suggestions */}
            {query.trim() === "" && (
              <div className="text-center mt-8">
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  Popular Searches
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {["Activewear", "T-Shirts", "Hoodies", "Gym"].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
