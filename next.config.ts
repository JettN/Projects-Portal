// next.config.ts
import type { NextConfig } from "next";

const nextConfig = {
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
} as any; // This "as any" tells TypeScript to shut up and accept these properties

export default nextConfig;