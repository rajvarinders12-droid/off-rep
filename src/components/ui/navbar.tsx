"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, User } from "lucide-react";
import NavbarCart from "@/app/(store)/navbar-cart";
import NavSidebar from "./nav-sidebar";
import SearchModal from "./search-modal";

interface NavbarProps {
  user: any;
}

export default function Navbar({ user }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "border-b border-zinc-200/80 bg-white/80 py-2 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/80"
            : "border-b border-transparent bg-white py-3 dark:bg-zinc-950"
        }`}
      >
        <div className="mx-auto flex w-full items-center justify-between px-4 sm:px-6 lg:px-12 xl:px-16">
          
          {/* Left: Navigation */}
          <div className="flex flex-1 items-center justify-start">
            {/* Mobile Hamburger Menu (Animated) */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden group relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900"
              aria-label="Toggle Menu"
            >
              <div className="flex flex-col items-center justify-center gap-1.5">
                <span className="block h-0.5 w-6 rounded-full bg-zinc-900 transition-all duration-300 group-hover:-translate-y-0.5 dark:bg-zinc-50"></span>
                <span className="block h-0.5 w-4 rounded-full bg-zinc-900 transition-all duration-300 group-hover:w-6 dark:bg-zinc-50"></span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              {[
                { name: "Home", href: "/" },
                { name: "All Products", href: "/shop" },
                { name: "About Us", href: "/about" },
                { name: "Contact Us", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="group relative text-sm font-semibold tracking-wide text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white py-2"
                >
                  {link.name}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transform bg-zinc-900 transition-transform duration-300 ease-out group-hover:scale-x-100 dark:bg-white" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: Logo */}
          <div className="flex flex-1 items-center justify-center">
            <Link href="/" className="relative flex items-center justify-center transition-transform hover:scale-105 active:scale-95">
              <Image
                src="/logo.png"
                alt="OFF-REP"
                width={200}
                height={80}
                className="h-12 md:h-14 w-auto object-contain dark:invert"
                priority
              />
            </Link>
          </div>

          {/* Right: Icons (Search, Account, Cart) */}
          <div className="flex flex-1 items-center justify-end gap-0.5 sm:gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="rounded-full p-2 sm:p-2.5 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href={user ? "/profile" : "/login"}
              className="rounded-full p-2 sm:p-2.5 text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
            <NavbarCart />
          </div>
        </div>
      </header>

      {/* Slide-out Menu */}
      <NavSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
