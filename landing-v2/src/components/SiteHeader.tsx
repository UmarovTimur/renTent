"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLenis } from "lenis/react";
import { LogoIcon, DragHandleIcon, ChevronRightIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

interface MenuItem {
  label: string;
  target: string; // element id
  thumb: string;
}

const MENU: MenuItem[] = [
  { label: "Overview", target: "top", thumb: "/images/jacket/panoplie.png" },
  { label: "Jackets", target: "chapter-1", thumb: "/images/jacket/menu.png" },
  { label: "Shoes", target: "chapter-2", thumb: "/images/shoes/menu.png" },
  { label: "Backpacks", target: "chapter-3", thumb: "/images/backpack/menu.png" },
];

const LANGUAGES = ["English", "Français", "Español", "Deutsch", "Italiano"];

/**
 * Fixed overlay header. Left: a section menu whose pill shows the active
 * chapter and expands to a thumbnail list that smooth-scrolls to each section.
 * Right: a language switcher. The bar switches light/dark treatment based on
 * the section beneath it (`data-header-theme`).
 */
export function SiteHeader() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [dark, setDark] = useState(true); // true = light text (over dark bg)
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState("English");
  const menuRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => {
      const els = document.elementsFromPoint(window.innerWidth / 2, 60);
      const section = els.find(
        (el) => el instanceof HTMLElement && el.dataset.chapter,
      ) as HTMLElement | undefined;
      if (section?.dataset.chapter) setActiveIdx(Number(section.dataset.chapter));
      const themed = els.find(
        (el) => el instanceof HTMLElement && el.dataset.headerTheme,
      ) as HTMLElement | undefined;
      setDark(themed?.dataset.headerTheme !== "light");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // close dropdowns on outside click / Escape
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const goTo = (target: string) => {
    setMenuOpen(false);
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
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex items-start justify-between px-4 py-4 transition-colors duration-500 md:px-6 md:py-5",
        dark ? "text-cream" : "text-charcoal",
      )}
    >
      {/* Left: section menu */}
      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => {
            setMenuOpen((o) => !o);
            setLangOpen(false);
          }}
          aria-expanded={menuOpen}
          className={cn(
            "flex items-center gap-3 rounded-full px-4 py-2.5 text-lg backdrop-blur-md transition-colors duration-300",
            dark ? "bg-white/10 hover:bg-white/15" : "bg-charcoal/8 hover:bg-charcoal/15",
          )}
        >
          <span className="min-w-[4.5rem] text-left font-display leading-none">
            {MENU[activeIdx]?.label ?? "Overview"}
          </span>
          <DragHandleIcon className="h-4 w-2.5 opacity-70" />
        </button>

        {/* Dropdown */}
        <div
          className={cn(
            "absolute left-0 top-[calc(100%+0.5rem)] w-60 origin-top-left overflow-hidden rounded-2xl bg-charcoal/85 p-2 text-cream shadow-xl backdrop-blur-xl transition-all duration-300",
            menuOpen
              ? "pointer-events-auto scale-100 opacity-100"
              : "pointer-events-none scale-95 opacity-0",
          )}
        >
          {MENU.map((item, i) => (
            <button
              key={item.label}
              type="button"
              onClick={() => goTo(item.target)}
              className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors duration-200 hover:bg-cream/10"
            >
              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cream">
                <Image src={item.thumb} alt="" fill sizes="48px" className="object-contain p-1" />
              </span>
              <span className="flex-1 font-display text-lg leading-none">{item.label}</span>
              <span
                className={cn(
                  "mr-1 h-1.5 w-1.5 rounded-full bg-cream transition-opacity",
                  i === activeIdx ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Center: logo */}
      <a
        href="#top"
        aria-label="Decathlon"
        onClick={(e) => {
          e.preventDefault();
          if (lenis) lenis.scrollTo(0);
          else window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="absolute left-1/2 top-4 -translate-x-1/2 md:top-5"
      >
        <LogoIcon className="h-[26px] w-[136px]" />
      </a>

      {/* Right: language switcher */}
      <div ref={langRef} className="relative">
        <button
          type="button"
          onClick={() => {
            setLangOpen((o) => !o);
            setMenuOpen(false);
          }}
          aria-expanded={langOpen}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-4 py-2.5 text-lg font-display leading-none backdrop-blur-md transition-colors duration-300",
            dark ? "bg-white/10 hover:bg-white/15" : "bg-charcoal/8 hover:bg-charcoal/15",
          )}
        >
          {lang}
          <ChevronRightIcon
            className={cn(
              "h-3 w-2 opacity-80 transition-transform duration-300",
              langOpen ? "-rotate-90" : "rotate-90",
            )}
          />
        </button>

        <div
          className={cn(
            "absolute right-0 top-[calc(100%+0.5rem)] w-44 origin-top-right overflow-hidden rounded-2xl bg-charcoal/85 p-2 text-cream shadow-xl backdrop-blur-xl transition-all duration-300",
            langOpen
              ? "pointer-events-auto scale-100 opacity-100"
              : "pointer-events-none scale-95 opacity-0",
          )}
        >
          {LANGUAGES.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => {
                setLang(l);
                setLangOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-display text-base transition-colors duration-200 hover:bg-cream/10"
            >
              {l}
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full bg-cream transition-opacity",
                  l === lang ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
