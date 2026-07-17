"use client";

import { ReactLenis } from "lenis/react";
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
      {children}
    </ReactLenis>
  );
}
