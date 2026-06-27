import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/tflyglobal",
        destination: "/tflyglobal/index.html",
      },
      {
        source: "/alyansneva",
        destination: "/alyansneva/index.html",
      },
      {
        source: "/goksugarden",
        destination: "/goksugarden/index.html",
      },
      {
        source: "/bellagarden",
        destination: "/bellagarden/index.html",
      },
    ];
  },
};

export default nextConfig;
