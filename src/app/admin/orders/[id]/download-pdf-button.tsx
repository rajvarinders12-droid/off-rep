"use client";

import { useState } from "react";
import { Download } from "lucide-react";

export default function DownloadPdfButton({ orderId }: { orderId: string }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    window.print();
  };

  return (
    <button
      onClick={handleDownload}
      className="flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors print:hidden"
    >
      <Download className="h-4 w-4" />
      Download PDF
    </button>
  );
}
