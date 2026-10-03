"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import { useLenis } from "lenis/react";
import { HandArrowLong, HandArrowSmall } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";

// Total time the loader occupies the screen, plus its own fade-out exit —
// exported so other components (header, hero) can time their entrance to
// play *after* the loader has actually left, not underneath it.
export const PRELOADER_COUNT_MS = 2400;
export const PRELOADER_TOTAL_MS = PRELOADER_COUNT_MS + 320;
export const PRELOADER_EXIT_MS = 700;
export const PRELOADER_REVEAL_MS = PRELOADER_TOTAL_MS + PRELOADER_EXIT_MS;
// How long each card takes to grow in
const CARD_GROW_MS = 900;

const COUNTER_ID = "preloader-counter";

// Set once the loader has played (or isn't wanted, e.g. after landing on a
// product page): client-side returns to the home page skip it then.
let played = false;

/** Skip the loader on the next client-side visit to the home page. */
export function skipPreloader() {
  played = true;
}

/**
 * The loader animates in pure CSS from the very first paint, before React has
 * loaded (on a slow phone that can take seconds). Time already spent counting
 * is read from the counter's CSS animation, so the exit and everything timed
 * after it (header, hero entrance) start when the count actually ends, not a
 * fixed time after hydration.
 */
function loaderElapsed() {
  const time = document.getElementById(COUNTER_ID)?.getAnimations()[0]?.currentTime;
  return typeof time === "number" ? time : 0;
}

/** Delay until the loader has fully left the screen, for entrance timers. */
export function msUntilReveal() {
  if (played && !document.getElementById(COUNTER_ID)) return 0;
  return Math.max(0, PRELOADER_REVEAL_MS - loaderElapsed());
}

// Small pre-sized copies of the tents' rental cards (512px webp, ~40 KB):
// they load right away instead of waiting on the image optimizer.
const tentCard = (name: string) => `/images/loader-cards/${name}.webp`;

/** Rental cards of the tents that spin in (from nothing, unwinding to their
 *  resting angle) as loading progresses, stacked exactly on top of each other
 *  — only the angle differs. `at` = % threshold. */
const LOADER_IMAGES = [
  {
    src: tentCard("tent-4"),
    // index into the preloader's localized card descriptions
    card: 1,
    rotate: -8,
    at: 6,
  },
  {
    src: tentCard("tent-8"),
    card: 2,
    rotate: 6,
    at: 38,
  },
  {
    src: tentCard("tent-12"),
    card: 3,
    rotate: -4,
    at: 70,
  },
];
// Extra turn each card unwinds while appearing, in the direction of its angle.
const SPIN_IN_DEG = 12;

/** When the ease-out counter (1 − (1 − t)³) reaches `pct`, in ms. */
const reachMs = (pct: number) => Math.round((1 - Math.cbrt(1 - pct / 100)) * PRELOADER_COUNT_MS);

/**
 * Intro loader: a percentage counter on cream with two handwritten captions,
 * matching the source. Counts to 100 over ~2.4s, then fades out.
 */
export function Preloader() {
  const [skipped] = useState(() => played);
  const [done, setDone] = useState(false);
  const lenis = useLenis();
  const t = useI18n().t.preloader;

  useEffect(() => {
    played = true;
    if (skipped) return;
    // The count itself runs in CSS; only the exit needs JS.
    const finish = setTimeout(() => setDone(true), Math.max(0, PRELOADER_TOTAL_MS - loaderElapsed()));
    return () => clearTimeout(finish);
  }, [skipped]);

  useEffect(() => {
    if (skipped) return;
    // Lock scrolling while the loader is up. Lenis swallows wheel and touch
    // while stopped; overflow is left alone so the scrollbar never toggles
    // (that made the layout jump and Chrome repaint it late).
    if (done) {
      lenis?.start();
      lenis?.scrollTo(0, { immediate: true });
    } else {
      lenis?.stop();
    }
  }, [done, lenis, skipped]);

  if (skipped) return null;

  return (
    <div
      aria-hidden={done}
      className={cn(
        "fixed inset-0 z-[100] bg-cream text-charcoal transition-opacity duration-700 ease-out",
        done && "pointer-events-none opacity-0",
      )}
    >
      {/* Centre stack: film stills that pop in and grow as loading progresses.
          Rendered first (below the text) and kept small/centred so they never
          cover the % counter or the handwritten labels. */}
      <div className="pointer-events-none absolute left-1/2 top-[45%] z-0 h-0 w-0">
        {LOADER_IMAGES.map((img, i) => (
          <div
            key={img.src}
            // Per-card angles and start time feed the CSS animation
            // (q-loader-card in globals.css); each starts as the counter
            // passes its threshold.
            style={
              {
                "--q-from": `${img.rotate - Math.sign(img.rotate) * SPIN_IN_DEG}deg`,
                "--q-to": `${img.rotate}deg`,
                animationDelay: `${reachMs(img.at)}ms`,
                animationDuration: `${CARD_GROW_MS}ms`,
                zIndex: i,
              } as CSSProperties
            }
            className="q-loader-card absolute left-0 top-0 aspect-[2/3] w-[clamp(9.5rem,42vw,11rem)] overflow-hidden rounded-xl shadow-[0_20px_50px_-15px_rgba(42,41,40,0.45)] ring-1 ring-charcoal/10 md:w-[clamp(11rem,20vw,16rem)]"
          >
            <Image
              src={img.src}
              alt={t.cards[img.card]}
              fill
              unoptimized
              // All of them show within the first seconds: fetched first, ahead of the page's own photos.
              loading="eager"
              fetchPriority="high"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Mountain spirit — upper right */}
      <div className="q-hand q-blink-shape absolute right-[12%] top-[14%] z-10 md:right-[22%] md:top-[28%] text-3xl font-semibold leading-none text-charcoal">
        <span className="-rotate-6 inline-block">{t.fast}</span>
        <HandArrowSmall className="mt-1 h-10 w-9 translate-x-8" />
      </div>

      {/* New season — center left */}
      <div className="q-hand q-blink-shape absolute left-[10%] top-[68%] z-10 md:left-[26%] md:top-[52%] text-3xl font-semibold leading-none text-charcoal">
        <span className="-rotate-6 inline-block whitespace-pre-line">{t.calling}</span>
        <HandArrowLong className="mt-1 h-11 w-14 translate-x-20" />
      </div>

      {/* Counter: counts in CSS (q-loader-count), so it runs before React loads */}
      <div className="absolute inset-x-0 bottom-[10%] z-10 text-center">
        <span id={COUNTER_ID} className="q-loader-count font-display text-2xl tabular-nums text-charcoal/70" />
      </div>
    </div>
  );
}
