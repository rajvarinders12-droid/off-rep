"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function MobileLoader() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Only animate once per session
    if (sessionStorage.getItem("hasLoadedSplash")) {
      setStage(4);
      return;
    }

    // Disable scrolling while loader is active
    document.body.style.overflow = "hidden";

    // Stage 1: Logo scales up (centered)
    const t1 = setTimeout(() => setStage(1), 50); 
    
    // Stage 2: Logo moves to top Navbar position (Background remains solid)
    const t2 = setTimeout(() => {
      setStage(2);
    }, 1500); 
    
    // Stage 3: Logo reached top. Reveal the website quickly!
    const t3 = setTimeout(() => {
      setStage(3);
    }, 2400);

    // Stage 4: Unmount component completely
    const t4 = setTimeout(() => {
      setStage(4);
      sessionStorage.setItem("hasLoadedSplash", "true");
      document.body.style.overflow = "";
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      document.body.style.overflow = "";
    };
  }, []);

  if (stage === 4) return null;

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            if (sessionStorage.getItem("hasLoadedSplash")) {
              document.documentElement.classList.add("skip-splash");
            }
          `,
        }}
      />
      <div 
        className={`fixed inset-0 z-[100] flex flex-col md:hidden transition-colors duration-[400ms] ease-in-out [.skip-splash_&]:!hidden ${
          stage >= 3 ? "bg-white/0 dark:bg-zinc-950/0 pointer-events-none" : "bg-white dark:bg-zinc-950 pointer-events-auto"
        }`}
      >
        <div 
          className={`absolute left-1/2 -translate-x-1/2 transition-all duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
            stage === 0 
              ? "top-1/2 -translate-y-1/2 opacity-100 scale-[2] blur-0" 
              : stage === 1 
              ? "top-1/2 -translate-y-1/2 opacity-100 scale-[2.5] blur-0" 
              : stage === 2 
              ? "top-[36px] -translate-y-1/2 opacity-100 scale-100 blur-0"
              : "top-[36px] -translate-y-1/2 opacity-100 scale-100 blur-0" 
          }`}
        >
        <Image
          src="/logo.png"
          alt="OFF-REP Logo"
          width={200}
          height={80}
          className="h-12 w-auto object-contain dark:invert"
          priority
        />
      </div>
    </div>
    </>
  );
}
