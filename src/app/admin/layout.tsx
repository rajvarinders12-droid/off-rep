"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Receipt, Store, LogOut, FolderTree, Tag, Menu, X, Info } from "lucide-react";
import { logout } from "../(auth)/actions";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-zinc-100 dark:bg-zinc-950 print:bg-white print:dark:bg-white">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-zinc-200 bg-white px-4 py-6 dark:border-zinc-800 dark:bg-zinc-900 transition-transform duration-300 ease-in-out lg:translate-x-0 print:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 px-2 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Admin Panel
            </span>
          </Link>
          <button 
            className="lg:hidden text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname === "/admin/dashboard" 
                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50" 
                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname?.startsWith("/admin/products") 
                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50" 
                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            Products
          </Link>
          <Link
            href="/admin/categories"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname?.startsWith("/admin/categories") 
                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50" 
                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            }`}
          >
            <FolderTree className="h-4 w-4" />
            Categories
          </Link>
          <Link
            href="/admin/orders"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname?.startsWith("/admin/orders") 
                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50" 
                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            }`}
          >
            <Receipt className="h-4 w-4" />
            Orders
          </Link>
          <Link
            href="/admin/coupons"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname?.startsWith("/admin/coupons") 
                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50" 
                : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            }`}
          >
            <Tag className="h-4 w-4" />
            Coupons
          </Link>
        </nav>

        <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Link
            href="/"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            <Store className="h-4 w-4" />
            View Storefront
          </Link>

          <form action={logout} className="mt-1">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-450 dark:hover:bg-red-950/30"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen w-full print:pl-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between lg:justify-end border-b border-zinc-200 bg-white px-4 sm:px-8 dark:border-zinc-800 dark:bg-zinc-900 print:hidden">
          <div className="flex items-center gap-3 lg:hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="font-bold text-zinc-900 dark:text-zinc-50">Admin Panel</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-zinc-150 px-2.5 py-0.5 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              Dev Mode
            </span>
          </div>
        </header>

        {/* Mobile Warning Note */}
        <div className="lg:hidden bg-zinc-50 border-b border-zinc-200 px-4 py-2 flex items-center justify-center gap-2 dark:bg-zinc-900/50 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400">
          <Info className="h-3.5 w-3.5" />
          <span>Note: Use desktop for the best admin experience.</span>
        </div>

        {/* Content Box */}
        <main className="flex-1 p-4 sm:p-8 print:p-0 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
