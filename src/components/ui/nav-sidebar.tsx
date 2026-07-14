"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ChevronRight, Home, ShoppingBag, Grid, Phone, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

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
            <Image 
              src="/logo.png" 
              alt="OFF-REP" 
              width={72} 
              height={24} 
              className="object-contain dark:invert" 
            />
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
          <div className="border-t border-zinc-100 p-6 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="flex flex-col gap-4">
              <a href="mailto:contact@offrep.in" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
                contact@offrep.in
              </a>
              <div className="flex items-center gap-4">
                <a href="https://www.instagram.com/offrep.in?igsh=Yzh3cTJibWd0b2V6" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-zinc-200/50 dark:bg-zinc-800 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-700 transition-all">
                  <InstagramIcon className="w-5 h-5" />
                </a>
                <a href="https://www.facebook.com/share/1Bv8jg9doi/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-zinc-200/50 dark:bg-zinc-800 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-700 transition-all">
                  <FacebookIcon className="w-5 h-5" />
                </a>
                <a href="https://wa.me/919056506403" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-zinc-200/50 dark:bg-zinc-800 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-700 transition-all">
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
