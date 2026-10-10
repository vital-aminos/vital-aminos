import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root explicitly — otherwise Next.js/Turbopack infers it
  // from the nearest lockfile, which on this machine is one folder up (in the
  // user's home directory) and gets (correctly) rejected.
  turbopack: {
    root: __dirname,
  },
  experimental: {
    // Product photos are uploaded through a Server Action (max 5 MB photo + form overhead).
    serverActions: { bodySizeLimit: "6mb" },
  },
};

export default nextConfig;
