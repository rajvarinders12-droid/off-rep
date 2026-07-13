import React from "react";
import Link from "next/link";
import { Mail, Phone, Instagram, MessageCircle } from "lucide-react";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

export const metadata = {
  title: "Contact Us — OFF-REP",
  description: "Get in touch with the OFF-REP team for support and inquiries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-zinc-900 dark:text-zinc-50">
            Contact Us
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
            Have a question about your order, sizing, or our products? We're here to help. Reach out to us through any of the channels below.
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer Support */}
          <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-8 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-wide text-zinc-900 dark:text-zinc-50 mb-6">Customer Support</h2>
              
              <div className="space-y-6">
                <a href="mailto:contact@offrep.in" className="group flex items-start gap-4 transition-opacity hover:opacity-70">
                  <div className="p-3 bg-zinc-200 dark:bg-zinc-800 rounded-full shrink-0">
                    <Mail className="w-5 h-5 text-zinc-900 dark:text-zinc-50" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Email Us</p>
                    <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mt-1">contact@offrep.in</p>
                  </div>
                </a>

                <a href="tel:+919056506403" className="group flex items-start gap-4 transition-opacity hover:opacity-70">
                  <div className="p-3 bg-zinc-200 dark:bg-zinc-800 rounded-full shrink-0">
                    <Phone className="w-5 h-5 text-zinc-900 dark:text-zinc-50" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">Call Us</p>
                    <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50 mt-1">9056506403</p>
                  </div>
                </a>
              </div>
            </div>

            <a 
              href="https://wa.me/919056506403" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 bg-[#25D366] text-white py-4 px-6 rounded-xl font-bold hover:bg-[#20bd5a] transition-colors"
            >
              <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
            </a>
          </div>

          {/* Social Media */}
          <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-wide text-zinc-900 dark:text-zinc-50 mb-6">Connect With Us</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8">
                Follow us on social media for the latest drops, community features, and workout inspiration. Tag us to be featured.
              </p>
              
              <div className="space-y-4">
                <a 
                  href="https://www.instagram.com/offrep.in?igsh=Yzh3cTJibWd0b2V6" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-zinc-900 dark:hover:border-zinc-50 transition-colors bg-white dark:bg-zinc-950"
                >
                  <Instagram className="w-6 h-6 text-zinc-900 dark:text-zinc-50 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">@offrep.in on Instagram</span>
                </a>

                <a 
                  href="https://www.facebook.com/share/1Bv8jg9doi/?mibextid=wwXIfr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-zinc-900 dark:hover:border-zinc-50 transition-colors bg-white dark:bg-zinc-950"
                >
                  <FacebookIcon className="w-6 h-6 text-zinc-900 dark:text-zinc-50 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">OFF-REP on Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
