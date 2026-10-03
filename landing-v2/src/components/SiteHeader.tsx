"use client";

import { useEffect, useRef, useState } from "react";
import { LoadingImage } from "@/components/LoadingImage";
import { useLenis } from "lenis/react";
import { GripVertical } from "lucide-react";
import { LogoIcon } from "@/components/icons";
import { msUntilReveal } from "@/components/Preloader";
import { MorphMenu, MorphMenuItem } from "@/components/MorphMenu";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";
import { localeHome } from "@/i18n/config";
import type { Dictionary } from "@/i18n";

interface MenuItem {
  target: Section; // section element id
  thumb: string;
}

type Section = keyof Dictionary["header"]["menu"];

// One entry per page section, in page order.
const MENU: MenuItem[] = [
  { target: "top", thumb: "/images/jacket/intersection-bg.jpg" },
  { target: "how", thumb: "/images/jacket/chapter-bg.jpg" },
  { target: "pricing", thumb: "/images/shoes/intersection-bg.jpg" },
  { target: "catalog", thumb: "/images/backpack/bg-38l.jpg" },
  { target: "contacts", thumb: "/images/jacket/mh500-black.jpg" },
];


/**
 * Fixed overlay header. Left: a section menu whose pill shows the current
 * section's name, filling from translucent to solid left to right as that
 * section is scrolled through, and expands to a thumbnail list that
 * smooth-scrolls to each section.
 * The bar switches light/dark treatment based on the section beneath it
 * (`data-header-theme`).
 */
export function SiteHeader() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [dark, setDark] = useState(true); // true = light text (over dark bg)
  const [visible, setVisible] = useState(false);
  const { t } = useI18n();
  const lenis = useLenis();
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [logoLight, setLogoLight] = useState(false);

  // Slide down only once the preloader has fully exited (not just started
  // exiting) — otherwise the header's own entrance plays hidden underneath it.
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), msUntilReveal());
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // A section becomes current once its top passes the middle of the
    // viewport and stays current until the next one does; the last one runs
    // to the end of the page. Section positions are measured only when the
    // layout changes (not on every scroll event), and the per-scroll work is
    // batched to one run per frame — this runs a lot on phones.
    let starts: number[] = [];
    let maxScroll = 0;
    const measure = () => {
      const probe = window.innerHeight / 2;
      const y = window.scrollY;
      maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      starts = MENU.map((item, i) => {
        const el = document.getElementById(item.target);
        if (i === 0 || !el) return 0;
        return Math.min(el.getBoundingClientRect().top + y - probe, maxScroll);
      });
    };

    // The nearest `data-header-theme` under a point: a dark block inside a
    // light section (calculator card, video, dark button) wins over it.
    const themeAt = (x: number, y: number) =>
      (
        document
          .elementsFromPoint(x, y)
          .find((el) => el instanceof HTMLElement && el.dataset.headerTheme) as HTMLElement | undefined
      )?.dataset.headerTheme;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      let idx = 0;
      starts.forEach((start, i) => {
        if (i > 0 && y >= start) idx = i;
      });
      const end = idx < MENU.length - 1 ? starts[idx + 1] : maxScroll;
      const span = end - starts[idx];
      const progress = span > 0 ? Math.min(1, Math.max(0, (y - starts[idx]) / span)) : 1;
      setActiveIdx(idx);
      // Progress goes straight to a CSS variable: no re-render while scrolling.
      headerRef.current?.style.setProperty("--menu-progress", progress.toFixed(4));

      setDark(themeAt(window.innerWidth / 2, 60) !== "light");
      // The logo checks right under itself, so it turns light over dark
      // blocks even where the rest of the bar sits on cream.
      const logo = logoRef.current?.getBoundingClientRect();
      if (logo) setLogoLight(themeAt(logo.left + logo.width / 2, logo.top + logo.height / 2) === "dark");
    };

    let raf = 0;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onLayout = () => {
      measure();
      onScroll();
    };
    // Page height changes as images and fonts load, not only on resize.
    const ro = new ResizeObserver(onLayout);
    ro.observe(document.body);
    onLayout();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onLayout);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onLayout);
    };
  }, []);

  const goTo = (target: string) => {
    if (target === "top") {
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(target);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: 0 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex items-start justify-between px-4 py-4 transition-[color,transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:px-6 md:py-5",
        dark ? "text-cream" : "text-charcoal",
        visible ? "translate-none opacity-100" : "-translate-y-full opacity-0",
      )}
    >
      {/* Left: section menu — the pill itself grows into the panel */}
      <MorphMenu
        dark={dark}
        upOnMobile
        centerOnMobile
        panelClassName="w-[17rem]"
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 md:relative md:bottom-auto md:left-auto md:translate-none"
        trigger={(open) => (
          <>
            {/* Every section name is stacked in a clip: the current one sits in
                place, earlier ones wait above and later ones below, so moving
                to the next section rolls the new name up from below (and back
                down when scrolling up). Each name is translucent with a solid
                copy on top: fully revealed for passed sections, revealed left
                to right by the scroll progress for the current one. */}
            <span className="relative -my-[0.15em] overflow-hidden py-[0.15em] text-left font-display font-bold leading-none">
              {MENU.map((item, i) => (
                <span
                  key={item.target}
                  aria-hidden={i !== activeIdx}
                  className={cn(
                    "block whitespace-nowrap transition-transform duration-[650ms] ease-[cubic-bezier(0.19,1,0.22,1)]",
                    i === activeIdx ? "relative" : "absolute left-0 top-[0.15em]",
                    i < activeIdx ? "-translate-y-[130%]" : i > activeIdx ? "translate-y-[130%]" : "translate-y-0",
                  )}
                >
                  <span className="opacity-50">{t.header.menu[item.target]}</span>
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-0",
                      i > activeIdx && "[clip-path:inset(0_100%_0_0)]",
                      i === activeIdx && "[clip-path:inset(0_calc(100%_-_var(--menu-progress,0)_*_100%)_0_0)]",
                    )}
                  >
                    {t.header.menu[item.target]}
                  </span>
                </span>
              ))}
            </span>
            <GripVertical
              strokeWidth={3}
              className={cn(
                "h-4 w-2.5 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]",
                open && "rotate-90",
              )}
            />
          </>
        )}
      >
        {(close) =>
          MENU.map((item, i) => (
            <MorphMenuItem
              key={item.target}
              index={i}
              active={i === activeIdx}
              label={t.header.menu[item.target]}
              thumb={<LoadingImage src={item.thumb} alt="" fill sizes="64px" className="object-cover" />}
              onClick={() => {
                close();
                goTo(item.target);
              }}
            />
          ))
        }
      </MorphMenu>

      {/* Logo: left on mobile, centered on desktop */}
      <div
        ref={logoRef}
        role="img"
        aria-label="rentTent"
        className={cn(
          "flex items-center px-1 py-2.5 transition-colors duration-300 md:absolute md:left-1/2 md:top-5 md:-translate-x-1/2",
          logoLight ? "text-cream" : "text-charcoal",
        )}
      >
        <LogoIcon className="h-[1.125rem] w-auto" />
      </div>

      {/* Right: language switcher — same growing pill, anchored right */}
      <LanguageSwitcher dark={dark} hrefFor={localeHome} />
    </header>
  );
}
