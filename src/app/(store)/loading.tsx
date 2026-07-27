import React from "react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-white dark:bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        {/* Subtle pulsing skeleton for desktop, on mobile the MobileLoader covers this anyway */}
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
        <p className="text-sm font-semibold tracking-widest text-zinc-500 uppercase">
          Loading OFF-REP...
        </p>
      </div>
    </div>
  );
}
