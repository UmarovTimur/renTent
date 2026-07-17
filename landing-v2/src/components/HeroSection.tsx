"use client";

import { useState } from "react";
import { PlayIcon } from "@/components/icons";

/**
 * Full-viewport video hero. "Feel alive in every footstep" with the accent
 * words in italic, a handwritten scroll cue bottom-left, and a "Discover full
 * video" card bottom-right that opens the full film.
 */
export function HeroSection() {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="top"
      data-chapter="0"
      data-header-theme="dark"
      className="relative h-[100svh] w-full overflow-hidden bg-charcoal text-cream"
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
      <h1 className="absolute inset-0 flex flex-col items-center justify-center text-center font-brand leading-[1.05]">
        <span className="text-[clamp(2.75rem,10vw,9.2rem)]">
          Feel <span className="italic pr-[0.12em]">alive</span> in
        </span>
        <span className="text-[clamp(2.75rem,10vw,9.2rem)]">
          <span className="italic pr-[0.14em]">every</span> footstep
        </span>
      </h1>

      {/* Scroll cue */}
      <span className="q-hand absolute bottom-6 left-4 z-10 text-lg text-cream md:left-6">
        Scroll to see full collection
      </span>

      {/* Discover full video card */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group absolute bottom-6 right-4 z-10 flex items-center gap-4 rounded-2xl bg-cream/95 p-2 pr-5 text-charcoal shadow-lg backdrop-blur-sm transition-transform duration-300 hover:scale-[1.02] md:right-6"
      >
        <span
          className="h-16 w-24 shrink-0 rounded-xl bg-cover bg-center"
          style={{ backgroundImage: "url(/images/intro/tracking.jpg)" }}
        />
        <span className="font-display text-lg leading-tight">
          Discover
          <br />
          full video
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/30 transition-colors group-hover:bg-charcoal group-hover:text-cream">
          <PlayIcon className="h-3.5 w-2.5 translate-x-px" />
        </span>
      </button>

      {/* Full video modal */}
      {open && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-charcoal/90 p-6"
          onClick={() => setOpen(false)}
        >
          <video
            className="max-h-full w-auto max-w-full rounded-xl"
            src="/videos/full-video.mp4"
            autoPlay
            controls
            playsInline
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="absolute right-6 top-6 text-cream text-2xl"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}
