import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // Let phones on the local network load dev assets / HMR (otherwise hydration
  // is blocked and the preloader sticks at 0%), and the ngrok tunnel too.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.ngrok-free.dev"],
  // Russian is served at the root: "/" renders the /ru page, and /ru itself
  // redirects back to "/" so there's one URL per language (/ and /en).
  async rewrites() {
    return [{ source: "/", destination: "/ru" }];
  },
  async redirects() {
    return [{ source: "/ru", destination: "/", permanent: true }];
  },
  images: {
    // AVIF where the browser supports it (noticeably smaller photos), WebP otherwise.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
