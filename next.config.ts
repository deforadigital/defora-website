import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/teklif",
        destination: "/teklif/index.html",
      },
    ];
  },
};

export default nextConfig;
