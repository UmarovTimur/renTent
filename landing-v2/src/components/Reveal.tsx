"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** stagger step 1-3 */
  delay?: 1 | 2 | 3;
  as?: ElementType;
  /** re-hide when out of view (default false — reveal once) */
  once?: boolean;
  /** marks a dark (or light) block so the header logo can switch over it */
  theme?: "dark" | "light";
}

/**
 * Fade-and-rise on scroll into view via IntersectionObserver.
 * Mirrors the source's reveal choreography without a scroll library.
 */
export function Reveal({ children, className, delay, as, once = true, theme }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      data-header-theme={theme}
      className={cn(
        "q-reveal",
        delay === 1 && "q-reveal-delay-1",
        delay === 2 && "q-reveal-delay-2",
        delay === 3 && "q-reveal-delay-3",
        inView && "is-in",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
