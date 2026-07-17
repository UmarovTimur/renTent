"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLenis } from "lenis/react";
import { HandArrowLong, HandArrowSmall } from "@/components/icons";
import { cn } from "@/lib/utils";

/** Cinematic film stills that pop in (small → full) as loading progresses,
 *  each at its own rotation, stacked in the centre. `at` = % threshold. */
const LOADER_IMAGES = [
  { src: "/images/loader/loader-01.jpg", rotate: -9, dx: -46, dy: -6, at: 6 },
  { src: "/images/loader/loader-02.jpg", rotate: 7, dx: 40, dy: -28, at: 30 },
  { src: "/images/loader/loader-03.jpg", rotate: -6, dx: -26, dy: 30, at: 55 },
  { src: "/images/loader/loader-04.jpg", rotate: 11, dx: 46, dy: 18, at: 78 },
];

/**
 * Intro loader: a percentage counter on cream with two handwritten captions,
 * matching the source. Counts to 100 over ~2.4s, then slides up out of view.
 */
export function Preloader() {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const start = performance.now();
    const duration = 2400;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out
      setPct(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Guaranteed completion even if rAF is throttled (e.g. background tab).
    const finish = setTimeout(() => {
      setPct(100);
      setDone(true);
    }, duration + 320);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(finish);
    };
  }, []);

  useEffect(() => {
    // Lock scrolling (native + Lenis) while the loader is up.
    if (done) {
      lenis?.start();
      lenis?.scrollTo(0, { immediate: true });
    } else {
      lenis?.stop();
    }
    document.body.style.overflow = done ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [done, lenis]);

  return (
    <div
      aria-hidden={done}
      style={{ transform: done ? "translateY(-100%)" : "translateY(0)" }}
      className={cn(
        "fixed inset-0 z-[100] bg-cream text-charcoal transition-transform duration-700 ease-[cubic-bezier(0.86,0,0.07,1)]",
        done && "pointer-events-none",
      )}
    >
      {/* Centre stack: film stills that pop in and grow as loading progresses.
          Rendered first (below the text) and kept small/centred so they never
          cover the % counter or the handwritten labels. */}
      <div className="pointer-events-none absolute left-1/2 top-[45%] z-0 h-0 w-0">
        {LOADER_IMAGES.map((img, i) => {
          const shown = pct >= img.at;
          return (
            <div
              key={img.src}
              style={{
                transform: `translate(calc(-50% + ${img.dx}px), calc(-50% + ${img.dy}px)) rotate(${img.rotate}deg) scale(${shown ? 1 : 0.2})`,
                opacity: shown ? 1 : 0,
                zIndex: i,
              }}
              className="absolute left-0 top-0 aspect-3/4 w-[clamp(8.5rem,16vw,11.5rem)] overflow-hidden rounded-xl shadow-[0_20px_50px_-15px_rgba(42,41,40,0.45)] ring-1 ring-charcoal/10 transition-all duration-[800ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] will-change-transform"
            >
              <Image
                src={img.src}
                alt=""
                fill
                sizes="11rem"
                className="object-cover"
                priority={i === 0}
              />
            </div>
          );
        })}
      </div>

      {/* Quechua Spirit — upper right */}
      <div className="q-hand absolute right-[22%] top-[28%] z-10 text-lg text-charcoal/40">
        <span className="-rotate-6 inline-block">Quechua spirit</span>
        <HandArrowSmall className="mt-1 h-8 w-7 translate-x-6 text-charcoal/40" />
      </div>

      {/* Our new collection — center left */}
      <div className="q-hand absolute left-[26%] top-[52%] z-10 text-lg text-charcoal/40">
        <span className="-rotate-6 inline-block">Our new collection 2025</span>
        <HandArrowLong className="mt-1 h-9 w-12 translate-x-16 text-charcoal/40" />
      </div>

      {/* Counter */}
      <div className="absolute inset-x-0 bottom-[10%] z-10 text-center">
        <span className="font-display text-2xl tabular-nums text-charcoal/30">
          {String(pct).padStart(2, "0")}%
        </span>
      </div>
    </div>
  );
}
