"use client";

import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { PRELOADER_REVEAL_MS } from "@/components/Preloader";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Full-viewport video hero. "Снаряжение для гор, которое не нужно покупать"
 * with the accent words in italic, a handwritten scroll cue bottom-left, and
 * a "Смотреть полное видео" card bottom-right that opens the full film.
 */
export function HeroSection() {
  const [open, setOpen] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);

  // Rise in from below only once the preloader has fully exited, matching
  // the header's timing.
  useEffect(() => {
    const t = setTimeout(() => setCardVisible(true), PRELOADER_REVEAL_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="top"
      data-chapter="0"
      data-header-theme="dark"
      className="relative h-svh w-full overflow-hidden bg-charcoal text-cream"
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/cover.jpg"
        src="/videos/hero-loop.mp4"
      />
      <div className="absolute inset-0 bg-charcoal/15" />
      <div className="q-grain absolute inset-0" />

      {/* Headline */}
      <h1 className="absolute inset-0 font-bold flex flex-col items-center justify-center text-center font-brand leading-[1.05]">
        <span className="text-[clamp(2.75rem,8vw,7.2rem)]">
          Аренда горного
        </span>
        <span className="text-[clamp(2.75rem,8vw,7.2rem)]">
          снаряжения в ташкенте
        </span>
      </h1>

      {/* Scroll cue */}
      <span className="q-hand absolute bottom-6 left-4 z-10 text-lg text-cream md:left-6">
        Прокрутите, чтобы увидеть снаряжение
      </span>

      {/* Discover full video card */}
      <button
        style={{ display: "none" }}
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group absolute bottom-6 right-4 z-10 flex items-center gap-4 rounded-2xl bg-cream/95 p-2 pr-5 text-charcoal shadow-lg backdrop-blur-sm transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] md:right-6",
          cardVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
        )}
      >
        <span
          className="h-16 w-24 shrink-0 rounded-xl bg-cover bg-center"
          style={{ backgroundImage: "url(/images/rent/lifestyle-hikers-dusk.jpg)" }}
        />
        <span className="font-display text-lg leading-tight">
          Смотреть
          <br />
          полное видео
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/30 transition-colors group-hover:bg-charcoal group-hover:text-cream">
          <Play fill="currentColor" strokeWidth={0} className="h-3.5 w-3.5 translate-x-px" />
        </span>
      </button>

      {/* Full video modal */}
      {
        open && (
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-charcoal/90 p-6"
            onClick={() => setOpen(false)}
          >
            {/* <video
            className="max-h-full w-auto max-w-full rounded-xl"
            src="/videos/full-video.mp4"
            autoPlay
            controls
            playsInline
            onClick={(e) => e.stopPropagation()}
          /> */}
            <Image src="/images/hero-bg.jpg" alt="" fill sizes="100vw" className="object-contain p-1 max-h-full w-auto max-w-full rounded-xl" />
            <button
              type="button"
              className="absolute right-6 top-6 text-cream text-2xl"
              aria-label="Закрыть"
            >
              ✕
            </button>
          </div>
        )
      }
    </section >
  );
}
