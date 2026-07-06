"use client";

import { useState } from "react";
import { Download } from "lucide-react";

export default function DownloadPdfButton({ orderId }: { orderId: string }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Dynamically import html2pdf to avoid SSR window errors
      const module = await import("html2pdf.js");
      const html2pdf = module.default ? module.default : module;
      
      const element = document.getElementById("order-details-container");
      if (!element) {
        console.error("Order details container not found");
        setIsDownloading(false);
        return;
      }

      const opt = {
        margin:       [15, 10, 15, 10],
        filename:     `Order_${orderId}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error: any) {
      console.error("Failed to generate PDF:", error);
      alert(`Failed to generate PDF: ${error?.message || "Unknown error"}. Try again.`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 disabled:opacity-70 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
    >
      <Download className="h-4 w-4" />
      {isDownloading ? "Generating PDF..." : "Download PDF"}
    </button>
  );
}
