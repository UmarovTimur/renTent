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
 * and would glide back towards them. Once the new page is laid out and Next
 * has placed the scroll (top, a #hash or the restored position on Back), re-
 * measure and adopt that position instantly.
 */
function RouteScrollSync() {
  const pathname = usePathname();
  const lenis = useLenis();
  // Only route changes: on the first load the preloader owns the scroll
  const seen = useRef<string | null>(null);

  useEffect(() => {
    if (seen.current === null) seen.current = pathname;
    if (!lenis || seen.current === pathname) return;
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        // Marked here, not above: a cancelled run (Strict Mode) must retry
        seen.current = pathname;
        lenis.resize();
        const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
        if (target) lenis.scrollTo(target, { immediate: true, force: true });
        else lenis.scrollTo(window.scrollY, { immediate: true, force: true });
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname, lenis]);

  return null;
}
