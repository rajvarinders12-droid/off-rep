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
      {/* Reference-Inspired Asymmetrical Hero */}
      <section className="relative w-full h-[calc(100svh-70px)] lg:h-[calc(100vh-80px)] overflow-hidden bg-white border-b border-zinc-200 dark:border-zinc-800 flex flex-col">
        
        {/* Mobile Metallic Logo (Huge) */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[160vw] h-[150px] z-40 pointer-events-none lg:hidden">
          <Image 
            src="/metallic.png" 
            alt="OFF-REP" 
            fill 
            sizes="100vw"
            className="object-contain object-top drop-shadow-xl scale-[1.5]" 
            priority 
          />
        </div>

        {/* ======================= DESKTOP LAYOUT (Coded Poster) ======================= */}
        <div className="hidden lg:block w-full h-full relative z-10 overflow-hidden bg-[#e6e6e6]">
          {/* Background Grid & Atmosphere */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#e6e6e6_100%)]" />
          
          {/* Crosshairs */}
          <div className="absolute top-8 left-8 text-zinc-400 font-light pointer-events-none">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2v20M2 12h20"/></svg>
          </div>
          <div className="absolute top-8 right-8 text-zinc-400 font-light pointer-events-none">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2v20M2 12h20"/></svg>
          </div>
          <div className="absolute bottom-8 left-8 text-zinc-400 font-light pointer-events-none">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2v20M2 12h20"/></svg>
          </div>
          <div className="absolute bottom-8 right-8 text-zinc-400 font-light pointer-events-none">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2v20M2 12h20"/></svg>
          </div>

          <div className="relative w-full h-full max-w-[1920px] mx-auto flex items-center">
            
            {/* Left Side: Typography */}
            <div className="w-[50%] h-full flex flex-col justify-center pl-16 xl:pl-32 z-20">
              
              {/* Metallic Logo */}
              <div className="relative w-[450px] h-[140px] xl:w-[650px] xl:h-[180px] mb-4">
                <Image 
                  src="/metallic.png" 
                  alt="OFF-REP" 
                  fill 
                  className="object-contain object-left drop-shadow-2xl" 
                  priority 
                />
              </div>

              {/* Huge Text */}
              <h1 className="text-4xl lg:text-5xl xl:text-[4.2rem] leading-[1.05] font-black uppercase tracking-tighter text-zinc-900 drop-shadow-xl mt-4">
                Built In <br/> Silence. <br/> <span className="text-zinc-500">Reps Speak.</span>
              </h1>
              
              <div className="flex items-center gap-6 mt-10 mb-8">
                <div className="h-[1px] w-20 bg-zinc-400"></div>
                <p className="text-xs xl:text-sm font-bold text-zinc-600 uppercase tracking-[0.3em] drop-shadow-md">
                  Premium Engineered Sportswear
                </p>
              </div>

              <div className="mt-4">
                <Link 
                  href="/shop" 
                  className="group inline-flex items-center gap-4 bg-zinc-900 text-white px-10 py-5 text-sm font-black uppercase tracking-[0.25em] shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:bg-black transition-all hover:-translate-y-1 hover:shadow-[0_25px_50px_rgba(0,0,0,0.4)]"
                >
                  Shop All
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </Link>
              </div>
            </div>

            {/* Right Side: Athletes */}
            <div className="absolute right-0 top-0 bottom-0 w-[55%] h-full z-10 flex items-center justify-center">
              
              {/* Glowing Background Ring */}
              <div className="absolute top-1/2 left-[45%] -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] rounded-full border border-white/40 bg-white/20 shadow-[0_0_100px_40px_rgba(255,255,255,0.8)] backdrop-blur-3xl pointer-events-none"></div>
              
              {/* Translucent UI Box 1 */}
              <div className="absolute top-[30%] left-[20%] w-24 h-32 backdrop-blur-md bg-white/5 border border-white/20 rounded-lg shadow-2xl z-20 pointer-events-none flex items-end p-3">
                <span className="text-[10px] text-zinc-500 font-mono">76</span>
              </div>

              {/* Translucent UI Box 2 */}
              <div className="absolute bottom-[20%] right-[15%] w-32 h-40 backdrop-blur-md bg-white/5 border border-white/20 rounded-lg shadow-2xl z-30 pointer-events-none flex flex-col justify-end p-4">
                 <div className="w-full h-[1px] bg-white/30 mb-2"></div>
                 <div className="w-full h-[1px] bg-white/30"></div>
              </div>

              {/* Standing Model (Back) */}
              <div className="absolute right-[8%] bottom-0 w-[45%] h-[105%] z-10 pointer-events-none">
                <Image 
                  src="/h1.png" 
                  alt="Model Standing" 
                  fill 
                  className="object-contain object-bottom drop-shadow-2xl" 
                  priority 
                />
              </div>

              {/* Seated Model */}
              <div className="absolute left-[0%] bottom-[0%] w-[55%] h-[95%] z-20 pointer-events-none">
                <Image 
                  src="/hero-model-seated.png" 
                  alt="Model Seated" 
                  fill 
                  className="object-contain object-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]" 
                  priority 
                />
              </div>

            </div>
          </div>
        </div>

        {/* ======================= MOBILE LAYOUT (Coded Asymmetrical) ======================= */}
        <div className="relative w-full h-full flex flex-col lg:hidden z-10">
          
          {/* Mobile Background Model */}
          <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
             <div className="absolute bottom-0 w-full h-[85%]">
               <Image 
                 src="/hero-model-seated.png" 
                 alt="Model" 
                 fill 
                 sizes="100vw"
                 className="object-contain object-bottom scale-110 origin-bottom drop-shadow-2xl opacity-90"
                 priority
               />
             </div>
             {/* Mobile Gradient Overlay for text readability */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent dark:from-zinc-950/90 dark:via-zinc-950/40" />
          </div>

          {/* Mobile Text Content */}
          <div className="relative z-20 w-full h-full flex flex-col justify-center px-6 sm:px-12 pt-40">
            <h1 className="text-[2.2rem] leading-[1.0] sm:text-5xl font-black uppercase tracking-tighter text-white drop-shadow-lg">
              Built In <br/> Silence. <br/> <span className="text-zinc-300 dark:text-zinc-400">Reps Speak.</span>
            </h1>
            
            <p className="mt-4 text-[0.65rem] sm:text-sm font-bold text-zinc-300 dark:text-zinc-400 uppercase tracking-[0.25em] drop-shadow-md">
              Premium Engineered Sportswear
            </p>
            
            <div className="mt-8 flex">
              <Link 
                href="/shop" 
                className="group flex items-center gap-3 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-8 py-4 text-xs font-black uppercase tracking-[0.25em] shadow-[0_20px_40px_rgba(0,0,0,0.4)] active:scale-95"
              >
                Shop All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
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
                  Our Categories
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
                  className="w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.666rem)] lg:w-[calc(25%-0.75rem)] group relative flex aspect-square sm:aspect-auto sm:min-h-[160px] flex-col justify-end overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-all hover:-translate-y-1 hover:border-zinc-700 hover:shadow-2xl hover:shadow-zinc-800/50"
                >
                  {category.imageUrl && (
                    <div className="absolute inset-0 pt-3 pr-3 pl-10 sm:pt-4 sm:pr-4 sm:pl-16 opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105 pointer-events-none">
                      <Image
                        src={category.imageUrl}
                        alt={category.name || ""}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-contain object-right-top"
                      />
                    </div>
                  )}
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent opacity-90 transition-opacity pointer-events-none" />
                  
                  <div className="relative pr-6 sm:pr-8 z-10 w-[80%]">
                    <h3 className="text-[0.8rem] sm:text-[0.9rem] font-black leading-tight text-white transition-colors">
                      {category.name}
                    </h3>
                    <p className="mt-1 sm:mt-1.5 text-[0.65rem] sm:text-xs font-semibold text-zinc-400">
                      {category._count.products}{" "}
                      {category._count.products === 1 ? "product" : "products"}
                    </p>
                  </div>
                  <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-zinc-500 transition-all group-hover:translate-x-1 group-hover:text-white z-10" />
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
          <div className="flex animate-marquee items-center gap-6 whitespace-nowrap px-4 w-max">
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
