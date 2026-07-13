import React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import Navbar from "@/components/ui/navbar";
import { createClient } from "@/utils/supabase/server";

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
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2.5">
                <ShoppingBag className="h-5 w-5 text-zinc-900 dark:text-zinc-50" />
                <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  OFF-REP
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                Premium quality products curated for the modern lifestyle.
                Discover collections that speak to your sense of style.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-900 dark:text-zinc-50">
                Quick Links
              </h3>
              <ul className="space-y-2.5">
                {["Home", "Shop", "Categories"].map((link) => (
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
                {["Contact Us", "Shipping Policy", "Returns & Exchanges", "FAQs"].map(
                  (link) => (
                    <li key={link}>
                      <span className="text-sm text-zinc-500 dark:text-zinc-400">
                        {link}
                      </span>
                    </li>
                  )
                )}
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
