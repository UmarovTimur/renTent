import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // Let phones on the local network load dev assets / HMR (otherwise hydration
  // is blocked and the preloader sticks at 0%), and the ngrok tunnel too.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.ngrok-free.dev"],
  // Russian is served at the root: "/" renders the /ru page, and /ru itself
  // redirects back to "/" so there's one URL per language (/ and /en).
  // Same for product pages: /catalog/<slug> is the Russian one.
  async rewrites() {
    return [
      { source: "/", destination: "/ru" },
      { source: "/catalog/:slug", destination: "/ru/catalog/:slug" },
    ];
  },
  async redirects() {
    return [
      { source: "/ru", destination: "/", permanent: true },
      { source: "/ru/catalog/:slug", destination: "/catalog/:slug", permanent: true },
    ];
  },
  images: {
    // AVIF where the browser supports it (noticeably smaller photos), WebP otherwise.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
