import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";
import Navbar from "@/components/ui/navbar";
import { createClient } from "@/utils/supabase/server";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col">

      {/* Main Navbar */}
      <Navbar user={user} />

      {/* Page Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 bg-zinc-50 dark:border-zinc-800/50 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand Column */}
            <div className="space-y-6">
              <Link href="/" className="flex items-center gap-2.5">
                <Image src="/logo.png" alt="OFF-REP Logo" width={32} height={32} className="h-8 w-auto dark:invert" />
                <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  OFF-REP
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                Premium quality products curated for the modern lifestyle.
                Discover collections that speak to your sense of style.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <a href="https://www.instagram.com/offrep.in?igsh=Yzh3cTJibWd0b2V6" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://www.facebook.com/share/1Bv8jg9doi/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
                  <FacebookIcon className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-900 dark:text-zinc-50">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {["Home", "Shop", "Categories", "About"].map((link) => (
                  <li key={link}>
                    <Link
                      href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                      className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-900 dark:text-zinc-50">
                Customer Service
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link href="/contact" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400 cursor-not-allowed">
                    Shipping Policy
                  </span>
                </li>
                <li>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400 cursor-not-allowed">
                    Returns & Exchanges
                  </span>
                </li>
                <li>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400 cursor-not-allowed">
                    FAQs
                  </span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-900 dark:text-zinc-50">
                Stay Updated
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Subscribe to get special offers and exclusive deals.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500"
                />
                <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <p className="text-center text-xs text-zinc-400 dark:text-zinc-500">
              &copy; {new Date().getFullYear()} OFF-REP. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
