import React from "react";
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Receipt, Store, LogOut, FolderTree, Tag } from "lucide-react";
import { logout } from "../(auth)/actions";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-100 dark:bg-zinc-950 print:bg-white print:dark:bg-white">
      {/* Sidebar Navigation */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-zinc-200 bg-white px-4 py-6 dark:border-zinc-800 dark:bg-zinc-900 print:hidden">
        <div className="mb-8 px-2">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
            <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Admin Panel
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            <ShoppingBag className="h-4 w-4" />
            Products
          </Link>
          <Link
            href="/admin/categories"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            <FolderTree className="h-4 w-4" />
            Categories
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
          >
            <Receipt className="h-4 w-4" />
            Orders
          </Link>
          <Link
            href="/admin/coupons"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
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
      <div className="pl-64 flex-1 flex flex-col min-h-screen print:pl-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-8 dark:border-zinc-800 dark:bg-zinc-900 print:hidden">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-zinc-150 px-2.5 py-0.5 text-xs font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              Dev Mode
            </span>
          </div>
        </header>

        {/* Content Box */}
        <main className="flex-1 p-8 print:p-0">{children}</main>
      </div>
    </div>
  );
}
