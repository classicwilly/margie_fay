import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Re-enable build-time ESLint: we fixed the primary typed supabase usages
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
