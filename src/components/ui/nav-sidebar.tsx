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
        className={`fixed inset-y-0 left-0 z-50 w-full max-w-[85vw] sm:max-w-sm transform bg-white dark:bg-zinc-950 shadow-2xl transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-20 items-center justify-between px-6 pt-4">
            <Image 
              src="/logo.png" 
              alt="OFF-REP" 
              width={80} 
              height={30} 
              className="object-contain dark:invert transition-transform hover:scale-105" 
            />
            <button
              onClick={onClose}
              className="group rounded-full bg-zinc-100 p-2.5 text-zinc-900 transition-all hover:scale-110 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
            </button>
          </div>

          {/* Nav Links */}
          <div className="flex-1 overflow-y-auto px-8 py-12">
            <nav className="flex flex-col gap-6">
              {links.map((link, i) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={onClose}
                    style={{ transitionDelay: isOpen ? `${i * 100 + 100}ms` : "0ms" }}
                    className={`group flex items-center justify-between transition-all duration-700 ease-out transform ${
                      isOpen ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
                    }`}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`p-2.5 rounded-xl transition-colors duration-300 ${isActive ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100 group-hover:text-zinc-900 dark:bg-zinc-900/50 dark:group-hover:bg-zinc-800 dark:group-hover:text-white'}`}>
                        <link.icon className="h-5 w-5" strokeWidth={2.5} />
                      </div>
                      <span className={`text-2xl font-black uppercase tracking-tighter transition-colors duration-300 ${
                        isActive 
                          ? "text-zinc-900 dark:text-white" 
                          : "text-zinc-400 group-hover:text-zinc-900 dark:text-zinc-500 dark:group-hover:text-white"
                      }`}>
                        {link.name}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer Info */}
          <div 
            style={{ transitionDelay: isOpen ? "500ms" : "0ms" }}
            className={`p-8 pb-10 transition-all duration-700 ease-out transform ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="flex flex-col gap-6">
              <a href="mailto:contact@offrep.in" className="text-sm font-bold tracking-widest uppercase text-zinc-900 hover:text-zinc-500 dark:text-zinc-50 dark:hover:text-zinc-400 transition-colors">
                contact@offrep.in
              </a>
              <div className="flex items-center gap-3">
                <a href="https://www.instagram.com/offrep.in?igsh=Yzh3cTJibWd0b2V6" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-900 hover:scale-110 hover:bg-zinc-200 dark:text-zinc-50 dark:hover:bg-zinc-800 transition-all">
                  <InstagramIcon className="w-5 h-5" />
                </a>
                <a href="https://www.facebook.com/share/1Bv8jg9doi/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-900 hover:scale-110 hover:bg-zinc-200 dark:text-zinc-50 dark:hover:bg-zinc-800 transition-all">
                  <FacebookIcon className="w-5 h-5" />
                </a>
                <a href="https://wa.me/919056506403" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-900 hover:scale-110 hover:bg-zinc-200 dark:text-zinc-50 dark:hover:bg-zinc-800 transition-all">
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
