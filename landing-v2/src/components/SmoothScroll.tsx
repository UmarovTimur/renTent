"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Lenis smooth-scroll provider (root mode = drives the window scroll, like the
 * source site). Descendants can call `useLenis()` to control it.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      }}
    >
      <RouteScrollSync />
      {children}
    </ReactLenis>
  );
}

/**
 * Lenis outlives client-side navigation (it lives in the layout), so after a
 * route change it still holds the previous page's height and scroll target
 * and would glide back towards them. Once the new page is laid out, re-measure
 * and jump to a #hash target, the restored position on Back/Forward, or the
 * top of the page. The top is set explicitly: Next skips its own scroll-to-top
 * when the new page's first element is already in view (e.g. product → product).
 */
function RouteScrollSync() {
  const pathname = usePathname();
  const lenis = useLenis();
  // Only route changes: on the first load the preloader owns the scroll
  const seen = useRef<string | null>(null);
  // Back/Forward keeps the browser's restored position instead of going to the top
  // (the path it landed on, so a hash-only Back can't leak into a later click)
  const historyNav = useRef<string | null>(null);

  useEffect(() => {
    const onPopState = () => {
      historyNav.current = window.location.pathname;
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (seen.current === null) seen.current = pathname;
    if (!lenis || seen.current === pathname) return;
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        // Marked here, not above: a cancelled run (Strict Mode) must retry
        seen.current = pathname;
        const restored = historyNav.current === window.location.pathname;
        historyNav.current = null;
        lenis.resize();
        const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
        if (target) lenis.scrollTo(target, { immediate: true, force: true });
        else lenis.scrollTo(restored ? window.scrollY : 0, { immediate: true, force: true });
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, lenis]);

  return null;
}
