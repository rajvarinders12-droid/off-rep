import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "About Us — OFF-REP",
  description: "Learn more about OFF-REP and our mission to redefine gym wear.",
};

export default function AboutPage() {
  return (
    <div className="bg-white dark:bg-zinc-950">
      {/* Hero Section (Starting Poster) */}
      <section className="relative w-full h-[calc(100svh-70px)] lg:h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-zinc-950">
        <Image
          src="/about1.png"
          alt="About OFF-REP"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Assuming the poster has its own text, we just let it display fully */}
      </section>

      {/* Our Story Section */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="order-2 lg:order-1 relative aspect-[4/5] md:aspect-square lg:aspect-[3/4] w-full overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900 shadow-2xl">
            <Image
              src="/hero-mobile.jpg"
              alt="OFF-REP Lifestyle"
              fill
              className="object-cover hover:scale-105 transition-transform duration-1000 ease-in-out"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10 rounded-3xl" />
          </div>
          
          <div className="order-1 lg:order-2 space-y-8">
            <div className="inline-block">
              <span className="text-xs font-bold tracking-widest uppercase bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-3 py-1 rounded-full">
                Our Story
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 uppercase">
              More than just <br /> activewear.
            </h2>
            <div className="space-y-6 text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
              <p>
                OFF-REP was born out of a simple necessity: gym clothes shouldn't only look good while you're lifting. We grew tired of the neon colors, excessive logos, and tight fits that didn't translate to real life.
              </p>
              <p>
                We engineered a minimalist, premium aesthetic that performs flawlessly under heavy iron, but still looks clean when you're grabbing coffee post-workout. Our oversized silhouettes and compression gear are cut to enhance your physique while providing maximum comfort.
              </p>
              <p>
                Every stitch, fabric choice, and seam is obsessively tested in the trenches. If it doesn't survive a grueling leg day, it doesn't make the cut.
              </p>
            </div>
            <div className="pt-4">
              <Link 
                href="/shop" 
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-white hover:opacity-70 transition-opacity"
              >
                Shop The Collection <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Values */}
      <section className="bg-zinc-50 dark:bg-zinc-900/50 py-24 border-y border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-zinc-200 dark:divide-zinc-800">
            <div className="flex flex-col items-center pt-8 md:pt-0 px-6">
              <div className="w-12 h-12 bg-zinc-900 dark:bg-white rounded-full mb-6 flex items-center justify-center">
                <span className="text-white dark:text-zinc-900 font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wide mb-3">Premium Quality</h3>
              <p className="text-zinc-500 dark:text-zinc-400">Crafted from heavy-weight, breathable fabrics designed to endure your toughest sessions.</p>
            </div>
            <div className="flex flex-col items-center pt-8 md:pt-0 px-6">
              <div className="w-12 h-12 bg-zinc-900 dark:bg-white rounded-full mb-6 flex items-center justify-center">
                <span className="text-white dark:text-zinc-900 font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wide mb-3">Aesthetic Fit</h3>
              <p className="text-zinc-500 dark:text-zinc-400">Tailored drops and precise tapers to complement your physique inside and outside the gym.</p>
            </div>
            <div className="flex flex-col items-center pt-8 md:pt-0 px-6">
              <div className="w-12 h-12 bg-zinc-900 dark:bg-white rounded-full mb-6 flex items-center justify-center">
                <span className="text-white dark:text-zinc-900 font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wide mb-3">Minimalist Design</h3>
              <p className="text-zinc-500 dark:text-zinc-400">No loud patterns. Just clean, monochromatic styles that speak for themselves.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      {/* Quote Section (End Poster) */}
      <section className="relative w-full h-[70vh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden bg-white text-center px-6">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about2.png"
            alt="OFF-REP Motivation"
            fill
            className="object-cover object-center"
          />
        </div>
        {/* Subtle white overlay to guarantee black text readability */}
        <div className="absolute inset-0 bg-white/20" />
        
        <div className="relative z-10 max-w-5xl mx-auto space-y-8">
          <svg className="mx-auto h-12 w-12 text-black mb-6 opacity-90 drop-shadow-md" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
          </svg>
          <blockquote className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black uppercase italic tracking-tighter text-black leading-[1.1] drop-shadow-lg">
            "The real growth happens <br className="hidden md:block" /> when you push past the <br className="hidden md:block" /> prescribed limits."
          </blockquote>
          <p className="mt-8 text-sm sm:text-lg lg:text-xl font-bold uppercase tracking-[0.3em] text-zinc-900 drop-shadow-md">
            Don't just count the reps. Go <span className="text-black font-black">OFF-REP</span>.
          </p>
          <div className="pt-8">
            <div className="w-20 h-1.5 bg-black mx-auto drop-shadow-md" />
          </div>
        </div>
      </section>
    </div>
  );
}
