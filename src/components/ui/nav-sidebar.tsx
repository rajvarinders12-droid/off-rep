"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { X, ChevronRight, Home, ShoppingBag, Grid, Phone } from "lucide-react";
import { usePathname } from "next/navigation";

interface NavSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavSidebar({ isOpen, onClose }: NavSidebarProps) {
  const pathname = usePathname();

  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const links = [
    { name: "Home", href: "/", icon: Home },
    { name: "All Products", href: "/shop", icon: ShoppingBag },
    { name: "About Us", href: "/about", icon: Grid },
    { name: "Contact Us", href: "/contact", icon: Phone },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-full max-w-sm transform bg-white dark:bg-zinc-950 shadow-2xl transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b border-zinc-100 px-6 dark:border-zinc-800">
            <span className="text-sm font-bold tracking-widest text-zinc-900 dark:text-zinc-50 uppercase">
              Menu
            </span>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav Links */}
          <div className="flex-1 overflow-y-auto px-4 py-8">
            <nav className="flex flex-col gap-2">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={onClose}
                    className={`group flex items-center justify-between rounded-xl px-4 py-4 transition-all ${
                      isActive
                        ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <link.icon
                        className={`h-5 w-5 ${
                          isActive
                            ? "text-white dark:text-zinc-900"
                            : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                        }`}
                      />
                      <span className="text-base font-semibold tracking-wide">
                        {link.name}
                      </span>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${
                        isActive
                          ? "text-white/70 dark:text-zinc-900/70"
                          : "text-zinc-300 dark:text-zinc-600"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer Info */}
          <div className="border-t border-zinc-100 p-6 dark:border-zinc-800">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              <p>Email: support@off-rep.com</p>
              <p className="mt-1">Follow us on Instagram</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
