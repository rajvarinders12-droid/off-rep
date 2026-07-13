import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const eurostile = localFont({
  src: "../../public/Eurostile-ExtendedTwo.woff",
  variable: "--font-heading",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

import { CartProvider } from "@/context/cart-context";

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
      className={`${eurostile.variable} ${plusJakarta.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
