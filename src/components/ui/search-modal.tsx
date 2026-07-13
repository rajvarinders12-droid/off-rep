"use client";

import React, { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Focus input when modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = inputRef.current?.value;
    if (query?.trim()) {
      onClose();
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`fixed inset-0 z-50 flex flex-col transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-y-0" : "-translate-y-10 pointer-events-none"
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

        <div className="mx-auto mt-20 w-full max-w-3xl px-4 sm:px-6">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-6 top-1/2 h-8 w-8 -translate-y-1/2 text-zinc-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products, keywords, categories..."
              className="w-full rounded-full border-2 border-zinc-200 bg-white py-6 pl-20 pr-8 text-xl font-medium text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-0 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-600 dark:focus:border-zinc-50 sm:text-3xl sm:py-8 sm:pl-24"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 sm:px-8 sm:py-4 sm:text-base"
            >
              Search
            </button>
          </form>

          <div className="mt-12 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <p>Popular Searches</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {["Activewear", "T-Shirts", "Hoodies", "Gym", "Oversized"].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    if (inputRef.current) inputRef.current.value = term;
                    onClose();
                    router.push(`/shop?q=${term}`);
                  }}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
