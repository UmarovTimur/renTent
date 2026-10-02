"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useLenis } from "lenis/react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";

// Monochrome (charcoal on transparent) versions of the brand logos in
// public/images/logos. Heights are tuned by eye so wordmarks and stacked
// logos read at a similar visual size.
const BRANDS = [
  { name: "Naturehike", src: "/images/logos/mono/naturehike.png", w: 387, h: 160, size: "h-11 md:h-14" },
  { name: "Snow Peak", src: "/images/logos/mono/snow-peak.png", w: 120, h: 28, size: "h-7 md:h-8" },
  { name: "Fire-Maple", src: "/images/logos/mono/fire-maple.png", w: 150, h: 22, size: "h-5 md:h-6" },
  { name: "Camel", src: "/images/logos/mono/camel.png", w: 80, h: 52, size: "h-11 md:h-14" },
  { name: "Outlander", src: "/images/logos/mono/outlander.png", w: 540, h: 52, size: "h-4 md:h-5" },
  { name: "MOQI", src: "/images/logos/mono/moqi.png", w: 254, h: 160, size: "h-11 md:h-14" },
  { name: "Bisinna", src: "/images/logos/mono/bisinna.png", w: 918, h: 160, size: "h-6 md:h-7" },
  { name: "UGREEN", src: "/images/logos/mono/ugreen.svg", w: 80, h: 26, size: "h-8 md:h-10" },
];

// Idle drift, px per second
const BASE_SPEED = 40;
// Extra px per second for each px/frame of page scroll speed
const SCROLL_BOOST = 18;
// How fast the scroll boost dies down (per 60fps frame)
const BOOST_DECAY = 0.92;

/**
 * Endless strip of the brands we rent out: the logo row is rendered twice
 * and the track is shifted by up to one copy's width, so it loops seamlessly.
 * It drifts on its own and follows the page scroll: scrolling speeds it up,
 * and the direction flips with it — down moves the logos left, up moves
 * them right, and they keep going that way after the scroll stops. The loop
 * only runs while the strip is on screen; edges fade into the page.
 */
export function BrandMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const t = useI18n().t.brands;

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = 0; // one copy of the logo row
    const measure = () => {
      width = (track.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    let x = 0;
    let dir = 1; // 1 = moving left (scrolled down), -1 = moving right
    let boost = 0;
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 64) / 1000 : 0;
      last = now;
      boost *= Math.pow(BOOST_DECAY, dt * 60);
      x += dir * (BASE_SPEED + boost) * dt;
      if (width > 0) x = ((x % width) + width) % width;
      track.style.transform = `translate3d(${-x}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (raf) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(section);

    // Scroll speed in px per frame, from Lenis or from native scroll deltas.
    const onScroll = (velocity: number) => {
      if (velocity === 0) return;
      dir = velocity > 0 ? 1 : -1;
      boost = Math.max(boost, Math.abs(velocity) * SCROLL_BOOST);
    };
    const offLenis = lenis?.on("scroll", ({ velocity }: { velocity: number }) => onScroll(velocity));
    let lastY = window.scrollY;
    const onNative = () => {
      onScroll(window.scrollY - lastY);
      lastY = window.scrollY;
    };
    if (!lenis) window.addEventListener("scroll", onNative, { passive: true });

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      offLenis?.();
      window.removeEventListener("scroll", onNative);
    };
  }, [lenis]);

  return (
    <section ref={sectionRef} aria-label={t.label} data-header-theme="light" className="overflow-hidden bg-cream py-4 md:py-[clamp(2rem,5vh,3.5rem)]">
      <div className="[mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div ref={trackRef} className="flex w-max will-change-transform">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy > 0 || undefined}
              className="flex shrink-0 items-center gap-[clamp(3rem,7vw,7rem)] pr-[clamp(3rem,7vw,7rem)]"
            >
              {BRANDS.map((brand) => (
                <li key={brand.name} className="flex shrink-0 items-center">
                  <Image
                    src={brand.src}
                    alt={copy > 0 ? "" : brand.name}
                    width={brand.w}
                    height={brand.h}
                    unoptimized
                    className={cn("w-auto opacity-75", brand.size)}
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
