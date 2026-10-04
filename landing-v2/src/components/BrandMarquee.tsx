"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
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
// Extra px/s of drift per px/s of page scroll (lower on touch screens, where
// a flick scrolls much faster than a mouse wheel), and its ceiling
const SCROLL_BOOST = 0.3;
const SCROLL_BOOST_TOUCH = 0.15;
const MAX_BOOST = 600;
// Smoothing time constants, seconds: how fast the measured scroll speed, the
// boost's rise and its fall, and the strip's own speed (incl. turning
// around) follow their targets. Time-based, so 60 and 120 Hz phones match.
const SCROLL_SMOOTHING = 0.12;
const BOOST_RISE = 0.25;
const BOOST_FALL = 0.8;
const SPEED_SMOOTHING = 0.35;

/** Fraction of the way to move toward a target this frame (exponential smoothing). */
const follow = (dt: number, tau: number) => 1 - Math.exp(-dt / tau);

/**
 * Endless strip of the brands we rent out: the logo row is rendered twice
 * and the track is shifted by up to one copy's width, so it loops seamlessly.
 * It drifts on its own and follows the page scroll: scrolling speeds it up,
 * and the direction flips with it — down moves the logos left, up moves
 * them right, and they keep going that way after the scroll stops. Speed,
 * boost and direction changes are all eased, so jumpy touch scrolling never
 * jerks the strip. The loop only runs while the strip is on screen; edges
 * fade into the page.
 */
export function BrandMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
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

    const boostPerScroll = window.matchMedia("(pointer: coarse)").matches ? SCROLL_BOOST_TOUCH : SCROLL_BOOST;
    let x = 0;
    let dir = 1; // 1 = moving left (scrolled down), -1 = moving right
    let speed = BASE_SPEED; // current signed speed, px/s
    let boost = 0;
    let scrollSpeed = 0; // smoothed page scroll speed, px/s
    let lastY = 0;
    let raf = 0;
    let last = 0;
    // The page scroll is sampled once per frame rather than taken from scroll
    // events, which arrive unevenly during touch scrolling and momentum.
    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 64) / 1000 : 0;
      last = now;
      const y = window.scrollY;
      if (dt > 0) {
        scrollSpeed += ((y - lastY) / dt - scrollSpeed) * follow(dt, SCROLL_SMOOTHING);
        if (Math.abs(scrollSpeed) > 30) dir = scrollSpeed > 0 ? 1 : -1;
        const target = Math.min(Math.abs(scrollSpeed) * boostPerScroll, MAX_BOOST);
        boost += (target - boost) * follow(dt, target > boost ? BOOST_RISE : BOOST_FALL);
        speed += (dir * (BASE_SPEED + boost) - speed) * follow(dt, SPEED_SMOOTHING);
      }
      lastY = y;
      x += speed * dt;
      if (width > 0) x = ((x % width) + width) % width;
      track.style.transform = `translate3d(${-x}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (raf) return;
      last = 0;
      lastY = window.scrollY;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(section);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
    };
  }, []);

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
