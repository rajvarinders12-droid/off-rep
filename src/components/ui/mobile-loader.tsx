"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function MobileLoader() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Only animate once per session using sessionStorage
    const hasLoaded = sessionStorage.getItem("hasLoadedSplash");
    if (hasLoaded) {
      setStage(3);
      return;
    }
    
    // Disable scrolling while loader is active
    document.body.style.overflow = "hidden";

    // Stage 0: Initial hidden state
    // Stage 1: Logo fades in and slightly scales up (centered)
    const t1 = setTimeout(() => setStage(1), 100); 
    
    // Stage 2: Background fades out, Logo shrinks and moves to top Navbar position
    const t2 = setTimeout(() => {
      setStage(2);
      sessionStorage.setItem("hasLoadedSplash", "true");
    }, 1400); 
    
    // Stage 3: Unmount component completely
    const t3 = setTimeout(() => {
      setStage(3);
      document.body.style.overflow = "";
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      document.body.style.overflow = "";
    };
  }, []);

  if (stage === 3) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col md:hidden transition-colors duration-700 ease-in-out ${
        stage === 2 ? "bg-white/0 dark:bg-zinc-950/0 pointer-events-none" : "bg-white dark:bg-zinc-950 pointer-events-auto"
      }`}
    >
      <div 
        className={`absolute left-1/2 -translate-x-1/2 transition-all duration-[800ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
          stage === 0 
            ? "top-1/2 -translate-y-1/2 opacity-0 scale-90 blur-[2px]" 
            : stage === 1 
            ? "top-1/2 -translate-y-1/2 opacity-100 scale-[1.15] blur-0" 
            : "top-[30px] -translate-y-1/2 opacity-0 scale-[0.54] blur-0" 
        }`}
      >
        {/* On stage 2, opacity goes to 0 as it hits the top because the real navbar logo is underneath it. It creates a seamless handoff. */}
        <Image
          src="/logo.png"
          alt="OFF-REP Logo"
          width={120}
          height={50}
          className="h-auto w-[120px] dark:invert"
          priority
        />
      </div>
    </div>
  );
}
