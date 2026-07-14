import React from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { ArrowRight, Sparkles, Truck, Shield, RotateCcw } from "lucide-react";

export const revalidate = 60; // Cache page for 60 seconds - revalidates in background

export default async function StorePage() {
  // Run featured products + categories in parallel for maximum speed
  const [featuredProducts, categories] = await Promise.all([
    db.product.findMany({
      where: { isFeatured: true, stock: { gt: 0 } },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    db.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    }),
  ]);

  // Only fetch latest products if no featured ones exist
  const latestProducts =
    featuredProducts.length > 0
      ? featuredProducts
      : await db.product.findMany({
          take: 8,
          orderBy: { createdAt: "desc" },
          include: { category: true },
          where: { stock: { gt: 0 } },
        });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full bg-white dark:bg-zinc-950">
        <Link href="/shop" className="block w-full group overflow-hidden">
          {/* Desktop Banner */}
          <div className="relative hidden w-full md:block aspect-[2.5/1]">
            <Image
              src="/hero-banner.png"
              alt="OFFREP New Collection"
              fill
              priority
              unoptimized
              quality={100}
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </div>
          {/* Mobile Banner */}
          <div className="relative block w-full md:hidden aspect-[3/4]">
            <Image
              src="/hero-mobile.jpg"
              alt="OFFREP New Collection"
              fill
              priority
              unoptimized
              quality={100}
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </div>
        </Link>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-zinc-100 bg-white dark:border-zinc-800/50 dark:bg-zinc-950">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-zinc-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0 dark:divide-zinc-800/50">
          {[
            {
              icon: Truck,
              title: "Free Shipping",
              desc: "On orders above ₹999",
            },
            {
              icon: Shield,
              title: "Secure Payments",
              desc: "100% secure checkout",
            },
            {
              icon: RotateCcw,
              title: "Easy Returns",
              desc: "7-day return policy",
            },
          ].map((badge) => (
            <div
              key={badge.title}
              className="flex items-center gap-4 px-6 py-5 sm:justify-center"
            >
              <badge.icon className="h-5 w-5 shrink-0 text-zinc-400 dark:text-zinc-500" />
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  {badge.title}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {badge.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="bg-white py-20 dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  Browse by
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                  Categories
                </h2>
              </div>
              <Link
                href="/categories"
                className="hidden items-center gap-1 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 sm:flex"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.slug}`}
                  className="group relative overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50 p-6 transition-all hover:border-zinc-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                >
                  {category.imageUrl && (
                    <div className="absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={category.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="relative">
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {category._count.products}{" "}
                      {category._count.products === 1 ? "product" : "products"}
                    </p>
                  </div>
                  <ArrowRight className="absolute bottom-6 right-6 h-4 w-4 text-zinc-300 transition-all group-hover:translate-x-1 group-hover:text-zinc-600 dark:text-zinc-700 dark:group-hover:text-zinc-400" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured / Latest Products */}
      <section className="bg-zinc-50 py-20 dark:bg-zinc-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                Hand-picked
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                {featuredProducts.length > 0
                  ? "Featured Products"
                  : "Latest Arrivals"}
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden items-center gap-1 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 sm:flex"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {latestProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:border-zinc-300 hover:shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                {/* Product Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                  {product.images.length > 0 ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        draggable={false}
                        className={`absolute inset-0 h-full w-full object-cover select-none pointer-events-none [-webkit-user-drag:none] [-webkit-touch-callout:none] transition-opacity duration-1000 ${
                          product.images.length > 1 ? "group-hover:opacity-0 group-active:opacity-0 group-focus:opacity-0" : "group-hover:scale-105 group-active:scale-105 group-focus:scale-105"
                        }`}
                      />
                      {product.images.length > 1 && (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={product.images[1]}
                          alt={`${product.name} alternate view`}
                          draggable={false}
                          className="absolute inset-0 h-full w-full object-cover opacity-0 select-none pointer-events-none [-webkit-user-drag:none] [-webkit-touch-callout:none] transition-opacity duration-1000 group-hover:opacity-100 group-active:opacity-100 group-focus:opacity-100"
                        />
                      )}
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-300 dark:text-zinc-600">
                      <Sparkles className="h-10 w-10" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  {product.category?.name && (
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">
                      {product.category.name}
                    </p>
                  )}
                  <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {product.name}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </p>
                    {product.compareAtPrice && Number(product.compareAtPrice) > Number(product.price) && (
                      <div className="flex items-center gap-2">
                        <del className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                          ₹{Number(product.compareAtPrice).toLocaleString("en-IN")}
                        </del>
                        <span className="rounded-sm bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          -{Math.round(((Number(product.compareAtPrice) - Number(product.price)) / Number(product.compareAtPrice)) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {latestProducts.length === 0 && (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <Sparkles className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
              <p className="mt-4 text-lg font-medium text-zinc-500 dark:text-zinc-400">
                No products yet
              </p>
              <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
                Products will appear here once the admin adds them.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="border-t border-zinc-100 bg-zinc-50 py-24 dark:border-zinc-800/50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold uppercase tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              Why Choose Us
            </h2>
            <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
              The OFF-REP standard of excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:shadow-xl transition-shadow">
              <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-6">
                <Truck className="w-8 h-8 text-zinc-900 dark:text-zinc-50" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wide text-zinc-900 dark:text-zinc-50 mb-3">Fast & Reliable Shipping</h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                We ensure your gear arrives quickly and securely, so you never miss a beat in your training schedule.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:shadow-xl transition-shadow">
              <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-6">
                <Shield className="w-8 h-8 text-zinc-900 dark:text-zinc-50" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wide text-zinc-900 dark:text-zinc-50 mb-3">Premium Quality</h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Engineered from high-performance materials tested by athletes. Built to endure your toughest workouts.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:shadow-xl transition-shadow">
              <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full mb-6">
                <RotateCcw className="w-8 h-8 text-zinc-900 dark:text-zinc-50" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wide text-zinc-900 dark:text-zinc-50 mb-3">Easy Returns</h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Not the perfect fit? No problem. We offer a hassle-free return and exchange policy to guarantee your satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
