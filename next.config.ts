// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  distDir: ".next",
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;