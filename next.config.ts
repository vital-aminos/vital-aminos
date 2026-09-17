import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root explicitly — otherwise Next.js/Turbopack infers it
  // from the nearest lockfile, which on this machine is one folder up (in the
  // user's home directory) and gets (correctly) rejected.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
