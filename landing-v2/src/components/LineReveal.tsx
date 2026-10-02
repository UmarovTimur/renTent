"use client";

import { Fragment, useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Stagger per line, matching the hero h1 (90ms steps). Literal classes so
// Tailwind generates them; indexes past the end reuse the last one.
const LINE_DELAYS = [
  "delay-0",
  "delay-[90ms]",
  "delay-[180ms]",
  "delay-[270ms]",
  "delay-[360ms]",
  "delay-[450ms]",
  "delay-[540ms]",
  "delay-[630ms]",
  "delay-[720ms]",
];

interface LineRevealProps {
  /** Plain text (already typographed — words glued with nbsp stay together). */
  text: string;
  as?: ElementType;
  className?: string;
  /** Offset into the stagger, to continue it from a block above. */
  start?: number;
  /** Words to render as external links, e.g. `{ Telegram: "https://t.me/…" }` */
  links?: Record<string, string>;
}

// Room the link arrow takes after a word, added to the probe so lines still
// wrap where the rendered text does (the icon is ~0.85em with its gap).
const LINK_ICON_ROOM = "\u2002\u2002";

/** Renders one token (words glued by nbsp count as one), linking any `links` word in it. */
function renderToken(token: string, links?: Record<string, string>): ReactNode {
  const word = links && Object.keys(links).find((w) => token.includes(w));
  if (!links || !word) return token;
  const [before, after] = [token.slice(0, token.indexOf(word)), token.slice(token.indexOf(word) + word.length)];
  return (
    <>
      {before}
      <a
        href={links[word]}
        target="_blank"
        rel="noopener noreferrer"
        className="whitespace-nowrap underline decoration-[0.06em] underline-offset-[0.15em] transition-colors duration-200 hover:text-[#26a5e4]"
      >
        {word}
        <ArrowUpRight aria-hidden strokeWidth={2.5} className="ml-[0.1em] inline-block size-[0.7em] align-[0.05em]" />
      </a>
      {after}
    </>
  );
}

/**
 * Text that rises line by line out of a mask when scrolled into view — the
 * same entrance as the hero h1. The lines are the text's real rendered lines:
 * the words are laid out in an invisible probe to find where they wrap, and
 * the visible text is regrouped into one masked row per line. Re-measured
 * when the width changes or the web font arrives.
 */
export function LineReveal({ text, as, className, start = 0, links }: LineRevealProps) {
  const Tag = (as ?? "p") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  const [inView, setInView] = useState(false);
  // True a couple of frames after the first split, so freshly mounted lines
  // are painted in their hidden position before they can start rising — even
  // when the text is already on screen when the split lands.
  const [ready, setReady] = useState(false);
  const shown = inView && ready;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Lay the words out in a throwaway invisible probe (built outside React,
    // so the text never appears twice in the markup) and read where they wrap.
    const split = () => {
      const words = text.split(" ");
      const probe = document.createElement("span");
      probe.setAttribute("aria-hidden", "true");
      Object.assign(probe.style, { position: "absolute", inset: "0 0 auto 0", visibility: "hidden" });
      const spans = words.map((word, i) => {
        const span = document.createElement("span");
        const room = links && Object.keys(links).some((w) => word.includes(w)) ? LINK_ICON_ROOM : "";
        span.textContent = i < words.length - 1 ? `${word}${room} ` : `${word}${room}`;
        probe.appendChild(span);
        return span;
      });
      el.appendChild(probe);
      const rows: string[][] = [];
      let top: number | null = null;
      spans.forEach((span, i) => {
        if (span.offsetTop !== top) {
          rows.push([]);
          top = span.offsetTop;
        }
        rows[rows.length - 1].push(words[i]);
      });
      probe.remove();
      const next = rows.map((row) => row.join(" "));
      setLines((prev) => (prev && prev.join("\n") === next.join("\n") ? prev : next));
      requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    };
    // Wrapping only depends on the width: skip height-only changes (the
    // split itself, the mobile address bar) instead of re-measuring.
    let width = -1;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      if (w === width) return;
      width = w;
      split();
    });
    ro.observe(el);
    document.fonts?.ready.then(split);
    return () => ro.disconnect();
  }, [text, links]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={cn("relative", className)}>
      {lines ? (
        lines.map((line, i) => (
          <span key={i} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
            <span
              className={cn(
                "block transition-transform duration-[1100ms] ease-[cubic-bezier(0.19,1,0.22,1)] motion-reduce:translate-y-0 motion-reduce:transition-none",
                LINE_DELAYS[Math.min(start + i, LINE_DELAYS.length - 1)],
                shown ? "translate-y-0" : "translate-y-[105%]",
              )}
            >
              {links
                ? line.split(" ").map((token, j) => (
                    <Fragment key={j}>
                      {j > 0 && " "}
                      {renderToken(token, links)}
                    </Fragment>
                  ))
                : line}
            </span>
          </span>
        ))
      ) : (
        // Holds the space (hidden) until the lines are known
        <span className="invisible">{text}</span>
      )}
    </Tag>
  );
}
