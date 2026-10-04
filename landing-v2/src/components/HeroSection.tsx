"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LoadingImage } from "@/components/LoadingImage";
import { useLenis } from "lenis/react";
import { Phone } from "lucide-react";
import { ArrowButton } from "@/components/ArrowButton";
import { TelegramIcon } from "@/components/icons";
import { MANAGER_PHONE, MANAGER_PHONE_HREF, MANAGER_TELEGRAM } from "@/lib/contacts";
import { msUntilReveal } from "@/components/Preloader";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";
import { productHref } from "@/i18n/config";
import type { CatalogProduct } from "@/data/products";

// Rail cards fetched right away (enough to fill a wide screen), the rest lazily.
const EAGER_CARDS = 6;
const LINE_DELAYS = ["delay-0", "delay-[90ms]", "delay-[180ms]"];

// Round outline buttons beside the catalog CTA, same height as it
const CONTACT_ROUND =
  "flex size-[3.4rem] shrink-0 items-center justify-center rounded-full border border-charcoal/20 text-charcoal transition-[color,background-color,border-color,opacity] duration-300";


/**
 * Typographic hero on cream: oversized dark headline on the left, a short
 * pitch + key facts on the right, a hairline rule, then a horizontal
 * scroll-snap slider of catalog cards that open the product pages.
 */
export function HeroSection({ products }: { products: CatalogProduct[] }) {
  const { locale, t: dict } = useI18n();
  const t = dict.hero;
  const [shown, setShown] = useState(false);
  const lenis = useLenis();

  // Play the entrance only once the preloader has left the screen.
  useEffect(() => {
    const t = setTimeout(() => setShown(true), msUntilReveal());
    return () => clearTimeout(t);
  }, []);

  const toCatalog = () => {
    const el = document.getElementById("catalog");
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: 0 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="top"
      data-chapter="0"
      data-header-theme="light"
      className="relative flex flex-col overflow-hidden md:min-h-svh bg-cream pb-[clamp(1.5rem,4vh,3rem)] pt-[5.25rem] md:pt-[clamp(6rem,13vh,9rem)] text-charcoal"
    >
      <div className="flex w-full flex-1 flex-col px-4 md:px-[1.6rem]">
        {/* Meta row */}
        <div
          className={cn(
            "flex items-center justify-between gap-4 text-[clamp(1.5rem,1.8vw,2rem)] leading-none text-charcoal transition-opacity delay-300 duration-1000",
            shown ? "opacity-100" : "opacity-0",
          )}
        >
          {/* Handwritten labels (Caveat only: Casey has no Cyrillic, and mixing the
              two in one phrase looks off) that "blink". Mobile: just the
              service label, on the left; md+: booking note left, service right. */}
          <span className="q-hand q-blink hidden font-[family-name:var(--font-caveat)] md:inline">{t.tagLeft}</span>
          <span className="q-hand q-blink font-[family-name:var(--font-caveat)]">{t.tagRight}</span>
        </div>

        {/* Headline + aside */}
        {/* Headline sized in container units so its longest line spans the
            container; the aside sits beside the short last line on desktop. */}
        <div className="@container relative mt-5 flex flex-col gap-4 md:mt-auto md:gap-8 md:pt-[clamp(2rem,6vh,4rem)]">
          <h1 className="whitespace-nowrap font-brand text-[min(calc(11.6cqw+2px),16svh)] font-bold leading-[0.86] tracking-[-0.035em] text-charcoal md:text-[min(8cqw,16svh)]">
            {/* Each line rises out of its own mask, with room below for descenders
                (g, y, р, у). The size sits on the h1 so the mask's em padding
                is measured in the headline's own size. */}
            {t.headline.map((line, i) => (
              <span key={line} className="-mb-[0.2em] block overflow-hidden pb-[0.2em]">
                {/* Invisible word break, so the heading's text reads "горного снаряжения", not "горногоснаряжения" */}
                {i > 0 && " "}
                <span
                  className={cn(
                    "block transition-transform duration-[1100ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
                    LINE_DELAYS[i],
                    // 100% alone leaves the glyph tops peeking into the mask's
                    // descender padding (tight 0.86 leading), so push past it too
                    shown ? "translate-y-0" : "translate-y-[calc(100%+0.4em)]",
                  )}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            className={cn(
              "max-w-[26rem] font-text text-[clamp(1rem,1.15vw,1.2rem)] leading-snug text-charcoal/70 transition-[opacity,transform] delay-500 duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)] lg:absolute lg:bottom-[1.4cqw] lg:right-0 lg:w-[27cqw]",
              shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
            )}
          >
            {t.lead}
          </p>
        </div>

        {/* Rule + facts */}
        <div
          className={cn(
            "mt-[clamp(1.5rem,4vh,2.75rem)] origin-left border-t border-charcoal transition-transform delay-200 duration-[1400ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
            shown ? "scale-x-100" : "scale-x-0",
          )}
        />
        <div
          className={cn(
            "flex flex-col gap-5 py-4 transition-opacity delay-700 duration-1000 md:py-5 lg:flex-row lg:items-center lg:justify-between",
            shown ? "opacity-100" : "opacity-0",
          )}
        >
          <dl className="grid grid-cols-2 gap-4 lg:flex lg:gap-[clamp(1.5rem,3.5vw,5rem)]">
            {t.facts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-3">
                <dt className="font-display text-[clamp(1.1rem,1.7vw,1.75rem)] font-medium leading-none tabular-nums">
                  {fact.value}
                </dt>
                <dd className="font-text text-xs leading-tight text-charcoal/55 md:text-sm">
                  {fact.label}
                </dd>
              </div>
            ))}
          </dl>
          {/* Contacts beside the CTA, all in one row: phone, Telegram, catalog
              button. Phones are too narrow for the written number, so there
              it becomes a round call button like the Telegram one. */}
          <div className="flex items-center gap-2.5 self-start sm:gap-5 lg:self-auto">
            <a
              href={MANAGER_PHONE_HREF}
              aria-label={`${t.call}: ${MANAGER_PHONE}`}
              className={cn(
                CONTACT_ROUND,
                "hover:border-charcoal hover:bg-charcoal hover:text-cream sm:size-auto sm:rounded-none sm:border-0 sm:hover:bg-transparent sm:hover:text-charcoal sm:hover:opacity-60",
              )}
            >
              <Phone strokeWidth={2.5} className="size-5 sm:hidden" />
              <span className="hidden whitespace-nowrap font-display text-[clamp(1rem,1.2vw,1.2rem)] font-medium tabular-nums sm:inline">
                {MANAGER_PHONE}
              </span>
            </a>
            <a
              href={MANAGER_TELEGRAM}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t.telegram}
              className={cn(CONTACT_ROUND, "hover:border-[#26a5e4] hover:bg-[#26a5e4] hover:text-white")}
            >
              <TelegramIcon className="size-5" />
            </a>
            <ArrowButton onClick={toCatalog}>{t.toCatalog}</ArrowButton>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "transition-[opacity,transform] delay-[800ms] duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]",
          shown ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
        )}
      >
        <HeroSlider
          // Only products with photos make it into the showcase rail.
          products={products.filter((p) => p.images.length > 0)}
          href={(product) => productHref(locale, product.slug)} />
      </div>
    </section>
  );
}

// Page-scroll → horizontal drift: px of slider shift per px of page scroll.
// Gentler on touch screens, where a flick covers a lot of page at once.
const DRIFT = 0.6;
const DRIFT_TOUCH = 0.3;
// Easing toward the target offset: time constant in seconds (time-based, so
// 60 and 120 Hz screens glide the same).
const EASE_TIME = 0.12;
const EASE_TIME_TOUCH = 0.22;
// Momentum after releasing a drag: per-frame velocity decay (closer to 1 =
// longer glide) and the velocity (px/frame) below which it counts as stopped.
const FRICTION = 0.955;
const STOP_VELOCITY = 0.05;
const MAX_VELOCITY = 70;

// Copies of the catalog laid end to end; the rail wraps by one copy's width,
// so the loop is seamless as long as two copies outlast the viewport.
const COPIES = 3;

/**
 * Endless drag-to-scroll rail of catalog cards. Its offset = drag offset +
 * page-scroll drift, so scrolling the page down slides it left and scrolling
 * up slides it back right. The offset is eased per frame, wrapped by one
 * catalog copy's width, and written straight to the DOM.
 */
function HeroSlider({
  products,
  href,
}: {
  products: CatalogProduct[];
  href: (product: CatalogProduct) => string;
}) {
  const loop = Array.from({ length: COPIES }, (_, copy) => products.map((product) => ({ product, copy }))).flat();
  const trackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const movedRef = useRef(false);
  const lenis = useLenis();

  useEffect(() => {
    const track = trackRef.current;
    const rail = railRef.current;
    if (!track || !rail) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const driftPerScroll = touch ? DRIFT_TOUCH : DRIFT;
    const easeTime = touch ? EASE_TIME_TOUCH : EASE_TIME;
    let last = 0;
    let drag = 0;
    let drift = 0;
    let x = 0;
    let raf = 0;
    let dragging = false;
    let velocity = 0; // px per 60fps frame; drag offset units

    // Width of one catalog copy: first card of copy 1 minus first card of copy 0.
    // Measured on resize only, not read back every animation frame.
    let w = 0;
    const measure = () => {
      const next = rail.children[products.length] as HTMLElement | undefined;
      const first = rail.children[0] as HTMLElement | undefined;
      w = next && first ? next.offsetLeft - first.offsetLeft : 0;
    };
    measure();

    const tick = (now: number) => {
      // Seconds since the last frame, as a count of 60fps frames for the fling
      const dt = last ? Math.min(now - last, 64) / 1000 : 1 / 60;
      last = now;
      const frames = dt * 60;
      // Released with speed: keep gliding, decaying smoothly to a stop.
      if (!dragging && velocity !== 0) {
        drag += velocity * frames;
        velocity *= Math.pow(FRICTION, frames);
        if (Math.abs(velocity) < STOP_VELOCITY) velocity = 0;
      }
      const t = drag + drift;
      // A finger drag follows 1:1; scroll drift and the fling glide in
      x += (t - x) * (dragging ? 1 : 1 - Math.exp(-dt / easeTime));
      if (Math.abs(t - x) < 0.1) x = t;
      const shown = w > 0 ? ((x % w) + w) % w : x;
      rail.style.transform = `translate3d(${-shown}px,0,0)`;
      raf = x === t && velocity === 0 ? 0 : requestAnimationFrame(tick);
      if (!raf) last = 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onScroll = (scroll: number) => {
      drift = reduced ? 0 : scroll * driftPerScroll;
      kick();
    };
    onScroll(lenis?.scroll ?? window.scrollY);
    const offLenis = lenis?.on("scroll", ({ scroll }: { scroll: number }) => onScroll(scroll));
    const onNativeScroll = () => onScroll(window.scrollY);
    if (!lenis) window.addEventListener("scroll", onNativeScroll, { passive: true });

    let startX = 0;
    let startDrag = 0;
    let lastX = 0;
    let lastT = 0;
    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5) movedRef.current = true;
      drag = startDrag - dx;
      // Smoothed pointer velocity, normalised to px per 60fps frame.
      const now = performance.now();
      const dt = Math.max(now - lastT, 1);
      const v = ((lastX - e.clientX) / dt) * (1000 / 60);
      velocity = velocity * 0.6 + v * 0.4;
      lastX = e.clientX;
      lastT = now;
      kick();
    };
    const stopListening = () => {
      dragging = false;
      track.classList.remove("cursor-grabbing");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
    function onUp() {
      stopListening();
      // Held still before letting go → no fling.
      if (performance.now() - lastT > 80 || reduced) velocity = 0;
      velocity = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity));
      kick();
    }
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      movedRef.current = false;
      dragging = true;
      velocity = 0;
      startX = lastX = e.clientX;
      lastT = performance.now();
      startDrag = drag;
      track.classList.add("cursor-grabbing");
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    };
    track.addEventListener("pointerdown", onDown);
    const onResize = () => {
      measure();
      kick();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      offLenis?.();
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("resize", onResize);
      track.removeEventListener("pointerdown", onDown);
      stopListening();
    };
  }, [lenis, products.length]);

  return (
    <div
      ref={trackRef}
      // A drag that moved shouldn't also open the card under the pointer.
      onClickCapture={(e) => {
        if (movedRef.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      className="cursor-grab touch-pan-y select-none overflow-hidden"
    >
      <div ref={railRef} className="flex w-max gap-5 px-4 will-change-transform md:px-[1.6rem]">
        {loop.map(({ product, copy }, i) => (
          <Link
            key={`${product.id}-${copy}`}
            href={href(product)}
            // The rail is dragged, not the link itself
            draggable={false}
            // Only the first copy is exposed to keyboard / screen readers.
            aria-hidden={copy > 0 || undefined}
            tabIndex={copy > 0 ? -1 : undefined}
            className="group block w-[clamp(11rem,52vw,14rem)] shrink-0 cursor-[inherit] text-left md:w-[clamp(16rem,21vw,24rem)]"
          >
            <span className="relative block aspect-[2/3] overflow-hidden rounded-[1.25rem] bg-[#dcd7ce]">
              <LoadingImage
                src={product.images[0]}
                alt={copy > 0 ? "" : product.name}
                fill
                draggable={false}
                // The first cards are on screen as soon as the loader lifts.
                loading={i < EAGER_CARDS ? "eager" : "lazy"}
                // Behind the loader's own cards, which are on screen first.
                fetchPriority="low"
                sizes="(max-width: 768px) 52vw, 21vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.04]"
              />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
