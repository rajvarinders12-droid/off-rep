import React from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { ArrowRight, Sparkles, Truck, Shield, RotateCcw, Star } from "lucide-react";

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
      {/* Engineered Luxury Editorial Hero Section */}
      <section className="relative w-full overflow-hidden bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        {/* Background AI Titanium Brand Backdrop */}
        <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20 pointer-events-none overflow-hidden">
          <Image
            src="/hero-studio-bg.jpg"
            alt="OFFREP Metallic Studio Backdrop"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Ambient Gradient Masks for High Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-zinc-950 dark:via-zinc-950/80 dark:to-transparent z-[1] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/60 dark:from-zinc-950 dark:via-transparent dark:to-zinc-950/60 z-[1] pointer-events-none" />

        {/* Main Responsive Grid Container */}
        <div className="relative z-[2] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[65vh] xl:min-h-[72vh]">
            
            {/* LEFT COLUMN: Luxury Typography & Clear Interactive Console (Span 7) */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left max-w-2xl pt-4 lg:pt-0">
              {/* Brand Tag */}
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-300 bg-white/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-zinc-900 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-100 mb-6">
                <Sparkles className="h-3.5 w-3.5 text-zinc-900 dark:text-zinc-100 fill-zinc-900 dark:fill-zinc-100 animate-pulse" />
                Built In Silence • Reps Speak
              </div>

              {/* Colossal Responsive Headline */}
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-[1.05]">
                Engineered For <br />
                <span className="italic bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500 bg-clip-text text-transparent drop-shadow-sm">
                  The Relentless.
                </span>
              </h1>

              {/* Brand Philosophy Subtitle */}
              <p className="mt-6 text-base sm:text-lg text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed max-w-xl">
                OFFREP is more than a sportswear brand. It represents discipline, consistency, and an uncompromising will to outwork everyone in high-performance luxury attire.
              </p>

              {/* Clean CTA Buttons (No Overlapping with Photos) */}
              <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-5">
                <Link
                  href="/shop"
                  className="group inline-flex items-center justify-center gap-3 rounded-full bg-zinc-900 px-8 py-4 text-sm sm:text-base font-bold text-white shadow-2xl transition-all duration-300 hover:bg-black hover:scale-105 active:scale-95 hover:shadow-zinc-900/40 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 dark:hover:shadow-white/20"
                >
                  Shop OFFREP
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-zinc-300 bg-white/70 backdrop-blur-md px-8 py-4 text-sm sm:text-base font-bold text-zinc-900 transition-all duration-300 hover:border-zinc-900 hover:bg-white hover:scale-105 active:scale-95 dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-white dark:hover:border-white dark:hover:bg-zinc-900"
                >
                  Explore More
                </Link>
              </div>

              {/* Trust & Quality Indicators */}
              <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-3 gap-4 max-w-md">
                <div>
                  <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider">Heavyweight</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Premium GSM Fabric</p>
                </div>
                <div>
                  <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider">Ergonomic</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Tapered Gym Fit</p>
                </div>
                <div>
                  <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider">Excellence</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Built To Endure</p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Dedicated Athlete Showcase Zone (Span 5) */}
            <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
              {/* Studio Glow Ring underneath model */}
              <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-zinc-200 via-zinc-300/40 to-transparent dark:from-zinc-800 dark:via-zinc-700/30 blur-2xl pointer-events-none" />

              {/* Clean Athlete Photograph Container */}
              <div className="relative w-[85%] sm:w-[70%] md:w-[60%] lg:w-full max-w-[450px] aspect-[4/5] z-10 transition-transform duration-700 hover:scale-[1.02]">
                <Image
                  src="/hero-model-seated.png"
                  alt="OFFREP Athlete Showcase"
                  fill
                  priority
                  sizes="(max-width: 1024px) 80vw, 450px"
                  className="object-contain object-bottom filter drop-shadow-[0_25px_30px_rgba(0,0,0,0.35)] dark:drop-shadow-[0_25px_35px_rgba(255,255,255,0.07)]"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Brand Marquee Section */}
      <section className="bg-white py-4 sm:py-6 overflow-hidden border-t border-zinc-100 border-b-2 border-b-zinc-900 dark:bg-zinc-950 dark:border-t-zinc-900 dark:border-b-black">
        <div className="relative flex w-full flex-nowrap items-center group">
          <div className="flex animate-marquee items-center gap-8 sm:gap-16 whitespace-nowrap px-4 w-max">
            {[...Array(12)].map((_, i) => (
              <React.Fragment key={i}>
                <span className="text-xl sm:text-2xl font-black uppercase italic tracking-widest text-zinc-900 dark:text-white">Consistency</span>
                <Image src="/logo.png" alt="logo" width={32} height={32} style={{ width: "auto" }} className="h-6 sm:h-8 object-contain dark:invert" />
                <span className="text-xl sm:text-2xl font-black uppercase italic tracking-widest text-zinc-900 dark:text-white">Discipline</span>
                <Image src="/logo.png" alt="logo" width={32} height={32} style={{ width: "auto" }} className="h-6 sm:h-8 object-contain dark:invert" />
                <span className="text-xl sm:text-2xl font-black uppercase italic tracking-widest text-zinc-900 dark:text-white">Excellence</span>
                <Image src="/logo.png" alt="logo" width={32} height={32} style={{ width: "auto" }} className="h-6 sm:h-8 object-contain dark:invert" />
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="bg-zinc-950 dark:bg-black py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  Browse by
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Categories
                </h2>
              </div>
              <Link
                href="/categories"
                className="hidden items-center gap-1 text-sm font-medium text-zinc-400 transition-colors hover:text-white sm:flex"
              >
                View All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-6 sm:mt-10 flex flex-wrap justify-center gap-3 sm:gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.slug}`}
                  className="w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.666rem)] lg:w-[calc(25%-0.75rem)] group relative flex aspect-square sm:aspect-auto sm:min-h-[160px] flex-col justify-end overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 transition-all hover:-translate-y-1 hover:border-zinc-700 hover:shadow-2xl hover:shadow-zinc-800/50"
                >
                  {category.imageUrl && (
                    <div className="absolute inset-0 opacity-40 mix-blend-overlay transition-all duration-500 group-hover:opacity-70 group-hover:scale-105">
                      <Image
                        src={category.imageUrl}
                        alt={category.name || ""}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover grayscale"
                      />
                    </div>
                  )}
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-80 transition-opacity group-hover:opacity-60" />
                  
                  <div className="relative pr-6 sm:pr-8 z-10">
                    <h3 className="text-sm sm:text-base font-bold sm:font-semibold leading-tight text-white group-hover:text-zinc-50 transition-colors">
                      {category.name}
                    </h3>
                    <p className="mt-1 sm:mt-2 text-xs text-zinc-400">
                      {category._count.products}{" "}
                      {category._count.products === 1 ? "product" : "products"}
                    </p>
                  </div>
                  <ArrowRight className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 h-4 w-4 text-zinc-500 transition-all group-hover:translate-x-1 group-hover:text-white z-10" />
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
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        draggable={false}
                        className={`object-cover select-none pointer-events-none [-webkit-user-drag:none] [-webkit-touch-callout:none] transition-opacity duration-1000 ${
                          product.images.length > 1 ? "group-hover:opacity-0 group-active:opacity-0 group-focus:opacity-0" : "group-hover:scale-105 group-active:scale-105 group-focus:scale-105"
                        }`}
                      />
                      {product.images.length > 1 && (
                        <Image
                          src={product.images[1]}
                          alt={`${product.name} alternate view`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          draggable={false}
                          className="object-cover opacity-0 select-none pointer-events-none [-webkit-user-drag:none] [-webkit-touch-callout:none] transition-opacity duration-1000 group-hover:opacity-100 group-active:opacity-100 group-focus:opacity-100"
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
      <section className="bg-zinc-950 dark:bg-black py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
              Why Choose Us
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              The OFF-REP standard of excellence.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <div className="w-[calc(50%-0.5rem)] md:flex-1 min-w-[140px] flex flex-col items-center text-center p-4 sm:p-6 md:p-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:shadow-2xl transition-all">
              <div className="p-3 sm:p-4 bg-zinc-800 rounded-full mb-4 sm:mb-6">
                <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-wide text-white mb-2 sm:mb-3">Fast Shipping</h3>
              <p className="text-xs sm:text-sm md:text-base text-zinc-400">
                We ensure your gear arrives quickly and securely.
              </p>
            </div>
            
            <div className="w-[calc(50%-0.5rem)] md:flex-1 min-w-[140px] flex flex-col items-center text-center p-4 sm:p-6 md:p-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:shadow-2xl transition-all">
              <div className="p-3 sm:p-4 bg-zinc-800 rounded-full mb-4 sm:mb-6">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-wide text-white mb-2 sm:mb-3">Premium Quality</h3>
              <p className="text-xs sm:text-sm md:text-base text-zinc-400">
                Engineered from high-performance materials.
              </p>
            </div>
            
            <div className="w-[calc(50%-0.5rem)] md:flex-1 min-w-[140px] flex flex-col items-center text-center p-4 sm:p-6 md:p-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:shadow-2xl transition-all">
              <div className="p-3 sm:p-4 bg-zinc-800 rounded-full mb-4 sm:mb-6">
                <RotateCcw className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-sm sm:text-lg md:text-xl font-bold uppercase tracking-wide text-white mb-2 sm:mb-3">Easy Returns</h3>
              <p className="text-xs sm:text-sm md:text-base text-zinc-400">
                Hassle-free return and exchange policy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="bg-zinc-50 dark:bg-zinc-950 py-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold uppercase tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
              What Our Athletes Say
            </h2>
            <p className="mt-4 text-lg text-zinc-500 dark:text-zinc-400">
              Real reviews from the OFF-REP community.
            </p>
          </div>
        </div>
        
        <div className="relative flex w-full flex-nowrap items-center group">
          <div className="flex animate-marquee items-center gap-6 whitespace-nowrap px-4 w-max hover:[animation-play-state:paused]">
            {[
              { name: "Gurpreet Singh", review: "The oversized tees are incredibly comfortable. Best pump cover I own." },
              { name: "Vikram Rathore", review: "Quality is unmatched. The ribbed tank perfectly complements my physique." },
              { name: "Arjun Kapoor", review: "Finally a brand that understands gym aesthetics. Fits true to size." },
              { name: "Maninder Dhillon", review: "Washed them multiple times and the fabric is still as good as new. Highly recommend." },
              { name: "Karan Desai", review: "Super fast delivery and the packaging felt really premium. 10/10." },
              { name: "Harjot Gill", review: "The compression shirts actually feel compressive unlike other brands. Love it." }
            ].map((item, idx) => (
              <div key={idx} className="w-[280px] sm:w-[320px] whitespace-normal rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 shadow-sm shrink-0">
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 italic mb-4 leading-relaxed line-clamp-4">"{item.review}"</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wide">— {item.name}</p>
              </div>
            ))}
            {/* Duplicate for infinite marquee effect */}
            {[
              { name: "Gurpreet Singh", review: "The oversized tees are incredibly comfortable. Best pump cover I own." },
              { name: "Vikram Rathore", review: "Quality is unmatched. The ribbed tank perfectly complements my physique." },
              { name: "Arjun Kapoor", review: "Finally a brand that understands gym aesthetics. Fits true to size." },
              { name: "Maninder Dhillon", review: "Washed them multiple times and the fabric is still as good as new. Highly recommend." },
              { name: "Karan Desai", review: "Super fast delivery and the packaging felt really premium. 10/10." },
              { name: "Harjot Gill", review: "The compression shirts actually feel compressive unlike other brands. Love it." }
            ].map((item, idx) => (
              <div key={`dup-${idx}`} className="w-[280px] sm:w-[320px] whitespace-normal rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-6 shadow-sm shrink-0">
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 italic mb-4 leading-relaxed line-clamp-4">"{item.review}"</p>
                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wide">— {item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
