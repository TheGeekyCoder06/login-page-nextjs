import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Ignore TypeScript errors during production builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
