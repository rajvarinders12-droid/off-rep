import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const eurostile = localFont({
  src: "../../public/Eurostile-ExtendedTwo.woff",
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

import { CartProvider } from "@/context/cart-context";
import MobileLoader from "@/components/ui/mobile-loader";

export const metadata: Metadata = {
  title: "Aesthetic E-commerce Store",
  description: "A premium Next.js & Supabase e-commerce experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${eurostile.variable} ${inter.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MobileLoader />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
