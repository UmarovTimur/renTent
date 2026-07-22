"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { ArrowButton } from "@/components/ArrowButton";
import { cn } from "@/lib/utils";
import type { Chapter as ChapterData, Outfit } from "@/data/chapters";

export function Chapter({ data }: { data: ChapterData }) {
  return (
    <div data-chapter={data.index}>
      <ChapterCover data={data} />
      <CategoryDivider title={data.divider.title} cards={data.divider.cards} index={data.index} />
      <div className="q-container">
        <ProductFeature data={data} />
      </div>
      {/* {data.outfits.map((outfit) => (
        <OutfitShowcase key={outfit.audience} outfit={outfit} />
      ))} */}
    </div>
  );
}

/* ---------- Cover (with scroll parallax) ---------- */
// The image is pre-scaled up by this much so it always overscans the frame;
// the ±5% parallax swing then happens entirely above that floor, so the
// image can never shrink below the section's edges and expose the bg behind it.
const COVER_IMAGE_OVERSCAN = 1.06;
const COVER_IMAGE_SCALE_RANGE = 0.05;
const COVER_TEXT_PARALLAX_PX = 46;

function ChapterCover({ data }: { data: ChapterData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const textWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const applyProgress = (progress: number) => {
      const scale =
        COVER_IMAGE_OVERSCAN + lerp(-COVER_IMAGE_SCALE_RANGE, COVER_IMAGE_SCALE_RANGE, progress);
      if (imageWrapRef.current) {
        imageWrapRef.current.style.transform = `scale(${scale})`;
      }
      if (textWrapRef.current) {
        const y = lerp(COVER_TEXT_PARALLAX_PX, -COVER_TEXT_PARALLAX_PX, progress);
        textWrapRef.current.style.transform = `translateY(${y}px)`;
      }
    };

    if (reduceMotion) {
      applyProgress(0.5);
      return;
    }

    let raf = 0;
    let running = false;
    // Same damped-follow technique as the category divider: the raw scroll
    // position is eased toward each frame rather than applied directly, so
    // the zoom/drift stays fluid instead of tracking every scroll tick 1:1.
    let smoothProgress: number | null = null;
    const DAMPING = 0.12;

    const tick = () => {
      const rect = section.getBoundingClientRect();
      const range = window.innerHeight + rect.height;
      const rawProgress = clamp((window.innerHeight - rect.top) / range, 0, 1);
      smoothProgress =
        smoothProgress === null
          ? rawProgress
          : smoothProgress + (rawProgress - smoothProgress) * DAMPING;
      applyProgress(smoothProgress);
      if (running || Math.abs(rawProgress - smoothProgress) > 0.0005) {
        raf = requestAnimationFrame(tick);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running) raf = requestAnimationFrame(tick);
        else cancelAnimationFrame(raf);
      },
      { rootMargin: "0px" },
    );
    io.observe(section);
    tick();

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={`chapter-${data.index}`}
      data-chapter={data.index}
      data-header-theme="dark"
      className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-charcoal text-cream"
    >
      <div ref={imageWrapRef} className="absolute inset-0" style={{ willChange: "transform" }}>
        <Image
          src={data.cover.image}
          alt={data.cover.headline}
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        />
      </div>
      <div className="absolute inset-0 bg-charcoal/20" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-charcoal/45 to-transparent" />
      <div className="q-grain absolute inset-0" />
      <div ref={textWrapRef} className="relative z-10" style={{ willChange: "transform" }}>
        <Reveal
          as="h2"
          className="px-6 text-center font-brand text-[clamp(2.75rem,9vw,9rem)] leading-[1.02]"
        >
          {data.cover.headline}
        </Reveal>
      </div>
      <div className="absolute bottom-6 left-4 z-10 md:left-6">
        <span className="q-hand block text-base text-cream/90">{data.cover.category}</span>
      </div>
      <div className="absolute bottom-6 right-4 z-10 font-text text-sm tracking-wide text-cream/85 md:right-6">
        {data.cover.location}
      </div>
    </section>
  );
}

/* ---------- Category divider with scroll-driven photo flythrough ---------- */

// scattered positions (desktop), pulled in close to the title — width/
// placement only; rotation is applied per-frame alongside the depth
// transform below.
const DIVIDER_SPOTS = [
  "left-[21%] top-[16%] w-[13rem]",
  "left-[33%] top-[54%] w-[10.5rem]",
  "right-[33%] top-[48%] w-[11.5rem]",
  "right-[20%] top-[18%] w-[14rem]",
];
const DIVIDER_ROTATIONS = [-4, 3, -2, 5];

// Fraction of the pin's scroll progress spent flying the photos through;
// the remainder lets the sticky title settle before the section unpins.
const PHOTO_RANGE = 0.85;
// Each card stays active for this fraction of PHOTO_RANGE, staggered by a
// much shorter stride so several cards overlap on screen at once.
const CARD_ACTIVE_FRAC = 0.55;
const TITLE_DRIFT_PX = 34;
const ENTER_Z = -640;
const EXIT_Z = 760;

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
// Ease-in-out with zero velocity at both ends — used instead of linear
// interpolation so the rise/hold/fall phases blend into each other with no
// kink in speed.
function smoothstep(t: number) {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

function CategoryDivider({
  title,
  cards,
  index,
}: {
  title: string;
  cards: string[];
  index: number;
}) {
  const wrapRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const activeLen = PHOTO_RANGE * CARD_ACTIVE_FRAC;
    const stride =
      cards.length > 1 ? (PHOTO_RANGE - activeLen) / (cards.length - 1) : 0;

    const applyProgress = (progress: number) => {
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const segStart = i * stride;
        const t = clamp((progress - segStart) / activeLen, 0, 1);
        // Two independently-eased ramps: `rise` carries the card in and
        // settles at its own size, `fall` carries it on through and out.
        // Both ease to zero velocity at their ends, so the combined opacity
        // and depth motion never has a linear-to-linear kink.
        const rise = smoothstep(t / 0.45);
        const fall = smoothstep((t - 0.55) / 0.45);
        const opacity = rise - fall;
        // Depth travels the whole ENTER_Z → EXIT_Z distance as one
        // continuous ease — no flat "hold" in the middle, so the card never
        // comes to a dead stop mid-flight (only opacity dips at the ends).
        const z = lerp(ENTER_Z, EXIT_Z, smoothstep(t));
        el.style.opacity = String(opacity);
        el.style.transform = `rotate(${DIVIDER_ROTATIONS[i % DIVIDER_ROTATIONS.length]}deg) translateZ(${z}px)`;
      });

      const titleP = clamp(progress, 0, PHOTO_RANGE) / PHOTO_RANGE;
      if (titleRef.current) {
        titleRef.current.style.transform = `translateY(${lerp(-TITLE_DRIFT_PX, TITLE_DRIFT_PX, titleP)}px)`;
      }
    };

    if (reduceMotion) {
      applyProgress(PHOTO_RANGE);
      return;
    }

    let raf = 0;
    let running = false;
    // The photos are driven by a damped-follow of the scroll progress
    // (rather than the raw value) so their motion stays continuous even
    // when the underlying scroll input arrives in discrete jumps (mouse-
    // wheel ticks, a paused trackpad gesture, etc).
    let smoothProgress: number | null = null;
    const DAMPING = 0.12;

    const tick = () => {
      const rect = wrap.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const rawProgress = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;
      smoothProgress =
        smoothProgress === null
          ? rawProgress
          : smoothProgress + (rawProgress - smoothProgress) * DAMPING;
      applyProgress(smoothProgress);
      // Keep animating while the eased value is still catching up to the
      // real scroll position, even if the section briefly stops moving.
      if (running || Math.abs(rawProgress - smoothProgress) > 0.0005) {
        raf = requestAnimationFrame(tick);
      }
    };

    // Sampling geometry every frame (rather than reading scroll position)
    // keeps this in sync whether the page is driven by Lenis or native scroll.
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running) raf = requestAnimationFrame(tick);
        else cancelAnimationFrame(raf);
      },
      { rootMargin: "0px" },
    );
    io.observe(wrap);
    tick();

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [cards.length]);

  return (
    <section
      ref={wrapRef}
      data-chapter={index}
      data-header-theme="light"
      className="relative bg-cream text-charcoal"
      style={{ height: `${100 + cards.length * 60}vh` }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Photo cluster (desktop) */}
        <div
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{ perspective: "1400px" }}
        >
          {cards.map((src, i) => (
            <div
              key={src + i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={cn(
                "absolute overflow-hidden rounded-2xl shadow-sm opacity-0",
                DIVIDER_SPOTS[i % DIVIDER_SPOTS.length],
              )}
              style={{ willChange: "transform, opacity" }}
            >
              <div className="relative aspect-[4/5] w-full">
                <Image src={src} alt="" fill sizes="16rem" className="object-cover" />
              </div>
            </div>
          ))}
        </div>
        <h3
          ref={titleRef}
          className="relative z-10 text-center font-display text-[clamp(3rem,11vw,8.5rem)] font-medium leading-none"
          style={{ willChange: "transform" }}
        >
          {title}
        </h3>
      </div>
    </section>
  );
}

/* ---------- Product feature (greige panels + toggle) ---------- */
function ProductFeature({ data }: { data: ChapterData }) {
  const [active, setActive] = useState(0);
  const product = data.products[active];
  return (
    <section
      data-chapter={data.index}
      data-header-theme="light"
      className="w-full bg-cream px-[1.6rem] py-[10vh] text-charcoal xl:px-[2rem]"
    >
      {/* toggle */}
      <div className="mb-[clamp(2rem,3vw,3.5rem)] flex items-center justify-center gap-[clamp(1.5rem,2.5vw,3rem)] font-display text-[clamp(1.75rem,3.4vw,3.4rem)] font-medium">
        {data.products.map((p, i) => (
          <button
            key={p.code}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "transition-colors duration-300",
              i === active ? "text-charcoal" : "text-charcoal/30 hover:text-charcoal/60",
            )}
          >
            {p.code}
          </button>
        ))}
      </div>

      {/* greige showcase panel — full width, 12-col grid, side padding only */}
      <Reveal className="relative w-full overflow-hidden rounded-[2rem] bg-[#dcd7ce] px-[clamp(1.5rem,4vw,6rem)] py-[clamp(3rem,6vw,8rem)]">
        <div className="grid grid-cols-1 items-center gap-[clamp(2rem,4vw,6rem)] lg:grid-cols-12">
          <div className="relative aspect-square w-full lg:col-span-5">
            <Image
              src={product.packshot}
              alt={product.code}
              fill
              sizes="(max-width: 1024px) 90vw, 42vw"
              className="object-contain"
            />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="font-display text-[clamp(1.75rem,2.6vw,2.7rem)] font-medium leading-[1.15]">
              {product.tagline}
            </p>
            <p className="mt-[clamp(1.25rem,1.5vw,2rem)] font-text text-[clamp(1.05rem,1.25vw,1.35rem)] leading-[1.4] text-charcoal/80">
              {product.detail}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Outfit showcase (Men / Women colorways) ---------- */
function OutfitShowcase({ outfit }: { outfit: Outfit }) {
  const [variantIdx, setVariantIdx] = useState(0);
  const [colorIdx, setColorIdx] = useState(0);
  const variant = outfit.variants[variantIdx];
  const color = variant.colorways[Math.min(colorIdx, variant.colorways.length - 1)];

  return (
    <section
      data-header-theme="dark"
      className="relative min-h-[90vh] overflow-hidden bg-charcoal py-[10vh] text-cream"
    >
      <Image src={outfit.background} alt="" fill sizes="100vw" className="object-cover opacity-70" />
      <div className="absolute inset-0 bg-charcoal/40" />
      <div className="q-container relative z-10">
        <div className="flex flex-col items-start gap-2">
          <span className="q-hand text-lg text-cream/80">Снаряжение для похода</span>
          <h4 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-medium leading-none">
            {outfit.audience}
          </h4>
        </div>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* product image */}
          <Reveal className="relative mx-auto aspect-[4/5] w-full max-w-[30rem]">
            <Image
              src={color.image}
              alt={`${variant.code} — ${color.name}`}
              fill
              sizes="(max-width: 1024px) 90vw, 30rem"
              className="object-contain"
            />
          </Reveal>

          {/* controls */}
          <div className="max-w-[26rem]">
            {/* variant toggle */}
            <div className="flex flex-wrap items-baseline gap-5 font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium">
              {outfit.variants.map((v, i) => (
                <button
                  key={v.code}
                  type="button"
                  onClick={() => {
                    setVariantIdx(i);
                    setColorIdx(0);
                  }}
                  className={cn(
                    "transition-colors duration-300",
                    i === variantIdx ? "text-cream" : "text-cream/40 hover:text-cream/70",
                  )}
                >
                  {v.code}
                </button>
              ))}
            </div>

            {/* colorways */}
            <p className="mt-6 font-text text-sm text-cream/70">{variant.colorwayCount}</p>
            <div className="mt-3 flex items-center gap-4">
              {variant.colorways.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  title={c.name}
                  onClick={() => setColorIdx(i)}
                  className={cn(
                    "h-8 w-8 rounded-full border transition-transform duration-300 hover:scale-110",
                    i === colorIdx ? "border-cream ring-2 ring-cream/40" : "border-cream/40",
                  )}
                  style={{ backgroundColor: c.swatch }}
                />
              ))}
            </div>
            <p className="mt-4 font-text text-base text-cream/90">{color.name}</p>

            {/* buy now */}
            <ArrowButton variant="light" className="mt-8">
              Забронировать
            </ArrowButton>
          </div>
        </div>
      </div>
    </section>
  );
}
