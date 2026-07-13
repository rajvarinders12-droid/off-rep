import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "saqmguekzowpzhlyqasd.supabase.co",
      },
    ],
  },
};

export default nextConfig;
