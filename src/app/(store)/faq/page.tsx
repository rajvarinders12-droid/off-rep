import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "FAQ — OFF-REP",
  description: "Frequently asked questions about OFF-REP.",
};

const faqs = [
  {
    question: "What makes OFF-REP different from other gym wear?",
    answer: "OFF-REP is engineered for the modern athlete. We combine premium, heavy-weight fabrics with minimalist, aesthetic fits that transition seamlessly from heavy training sessions to everyday life. No loud logos, just pure performance and style.",
  },
  {
    question: "How do your sizes run?",
    answer: "Our garments feature an athletic, oversized fit designed to complement your physique. We recommend ordering your true size for the intended aesthetic drop, or sizing down if you prefer a more fitted look.",
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy on all unworn items with tags still attached. If the fit isn't absolutely perfect, you can exchange it for a different size or return it for a full refund.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship worldwide. International shipping rates and delivery times vary by location and are calculated at checkout. All duties and taxes are the responsibility of the customer.",
  },
  {
    question: "How should I care for my OFF-REP gear?",
    answer: "To ensure maximum longevity of the heavy-weight cotton and premium blends, we recommend washing all items inside out on a cold cycle and hang drying. Avoid tumble drying to prevent any unwanted shrinkage.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-20 text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-900 dark:text-zinc-50 mb-6">
            Frequently Asked
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-medium">
            Everything you need to know before you go OFF-REP.
          </p>
        </div>

        <div className="space-y-10">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="group border-b border-zinc-200 dark:border-zinc-800 pb-10 transition-colors hover:border-zinc-900 dark:hover:border-zinc-50"
            >
              <h3 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 tracking-wide">
                {faq.question}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base md:text-lg">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center">
          <p className="text-zinc-500 dark:text-zinc-400 mb-6 font-medium">Still have questions?</p>
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-white hover:opacity-70 transition-opacity"
          >
            Contact Support <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
