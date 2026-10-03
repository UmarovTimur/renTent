"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

const EASE = "ease-[cubic-bezier(0.19,1,0.22,1)]";

// Per-row stagger as the pill opens: thumbnails spin in first, labels follow.
const THUMB_DELAYS = ["delay-[60ms]", "delay-[110ms]", "delay-[160ms]", "delay-[210ms]", "delay-[260ms]"];
const TEXT_DELAYS = ["delay-[120ms]", "delay-[170ms]", "delay-[220ms]", "delay-[270ms]", "delay-[320ms]"];

// Trigger row: content pushed to both edges as it widens, equal padding above
// and below the label. The rows below start right under it; the list inset
// and the row padding are 0.25rem each. Closed, the shell is a full pill;
// open, its radii are concentric: the shell's 1rem minus each 0.25rem inset
// gives 0.75rem for a row and 0.5rem for its thumbnail.
const TRIGGER_CLASS = "flex items-center justify-between gap-3 px-3.5 py-2.5 text-base";

interface Size {
  w: number;
  h: number;
}

const MorphMenuContext = createContext<{ open: boolean }>({ open: false });

/**
 * Glass pill that grows into its own dropdown panel. Opens on mouse hover
 * (click / tap as a fallback), closes the moment the pointer leaves, on an
 * outside click or on Escape.
 * The panel is laid out at full size and clipped by the shell, whose width
 * and height animate between the trigger's and the panel's measured sizes.
 * The real trigger button stretches with the shell (space-between), so its
 * icon slides out to the edge as the pill grows; an invisible copy of it in
 * the panel's flow provides the closed-pill size and reserves its row.
 */
export function MorphMenu({
  trigger,
  children,
  dark,
  align = "left",
  upOnMobile = false,
  centerOnMobile = false,
  panelClassName,
  className,
}: {
  /** pill content; receives the open state */
  trigger: (open: boolean) => ReactNode;
  /** receives a `close` callback for items that should dismiss the menu */
  children: (close: () => void) => ReactNode;
  /** true = over dark sections (lighter smoked glass), else a deeper charcoal tint */
  dark: boolean;
  /** which edge of the pill the panel is anchored to */
  align?: "left" | "right";
  /** below md, grow upward (for a pill docked at the bottom of the screen) */
  upOnMobile?: boolean;
  /** below md, grow symmetrically around the pill's centre (pill docked at screen centre) */
  centerOnMobile?: boolean;
  /** sizing / layout of the full panel (e.g. its width, mobile direction) */
  panelClassName?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [triggerSize, setTriggerSize] = useState<Size | null>(null);
  const [panelSize, setPanelSize] = useState<Size | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const sizer = sizerRef.current;
    if (!panel || !sizer) return;
    const ro = new ResizeObserver(() => {
      setTriggerSize({ w: sizer.offsetWidth, h: sizer.offsetHeight });
      setPanelSize({ w: panel.offsetWidth, h: panel.offsetHeight });
    });
    ro.observe(panel);
    ro.observe(sizer);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      ro.disconnect();
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // While open, a tap or click anywhere outside only closes the menu: it is
  // caught on window in the capture phase, before it can reach anything else
  // (a product card, a button, the other pill), and swallowed. Scrolling
  // still works — touch scrolling doesn't go through these events.
  useEffect(() => {
    if (!open) return;
    const outside = (e: Event) => !rootRef.current?.contains(e.target as Node);
    const swallow = (e: Event) => {
      if (!outside(e)) return;
      e.preventDefault();
      e.stopPropagation();
    };
    const onClick = (e: Event) => {
      if (!outside(e)) return;
      swallow(e);
      setOpen(false);
    };
    const opts = { capture: true };
    window.addEventListener("pointerdown", swallow, opts);
    window.addEventListener("mousedown", swallow, opts);
    window.addEventListener("click", onClick, opts);
    return () => {
      window.removeEventListener("pointerdown", swallow, opts);
      window.removeEventListener("mousedown", swallow, opts);
      window.removeEventListener("click", onClick, opts);
    };
  }, [open]);

  const size = open ? panelSize : triggerSize;

  return (
    <div
      ref={rootRef}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setOpen(false);
      }}
      className={cn("relative", className)}
    >
      {/* Keeps the pill's footprint in the header layout; the shell overlays it. */}
      <div aria-hidden style={triggerSize ? { width: triggerSize.w, height: triggerSize.h } : undefined} />
      <div
        className={cn(
          "absolute overflow-hidden rounded-full text-white backdrop-blur-md md:backdrop-blur-xl transition-[width,height,border-radius,background-color] duration-[650ms]",
          EASE,
          align === "right" ? "right-0" : "left-0",
          centerOnMobile && "max-md:left-1/2 max-md:right-auto max-md:-translate-x-1/2",
          upOnMobile ? "bottom-0 md:bottom-auto md:top-0" : "top-0",
          dark ? "bg-black/25" : "bg-charcoal/40",
        )}
        // Closed: a full pill (radius = half its height, not 9999px, so the
        // radius animates smoothly); open: the panel's 1rem corners.
        style={
          size && triggerSize
            ? { width: size.w, height: size.h, borderRadius: open ? "1rem" : triggerSize.h / 2 }
            : undefined
        }
      >
        <div
          ref={panelRef}
          className={cn(
            "absolute flex",
            upOnMobile ? "bottom-0 flex-col-reverse md:bottom-auto md:top-0 md:flex-col" : "top-0 flex-col",
            align === "right" ? "right-0 items-end" : "left-0 items-start",
            centerOnMobile && "max-md:left-1/2 max-md:right-auto max-md:-translate-x-1/2",
            panelClassName,
          )}
        >
          <div ref={sizerRef} aria-hidden className={cn(TRIGGER_CLASS, "invisible w-max")}>
            {trigger(open)}
          </div>
          <MorphMenuContext.Provider value={{ open }}>
            <ul
              className={cn(
                "flex w-full flex-col px-1",
                upOnMobile ? "pt-1 md:pb-1 md:pt-0" : "pb-1",
              )}
            >
              {children(() => setOpen(false))}
            </ul>
          </MorphMenuContext.Provider>
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className={cn(
            TRIGGER_CLASS,
            "absolute inset-x-0",
            upOnMobile ? "bottom-0 md:bottom-auto md:top-0" : "top-0",
          )}
        >
          {trigger(open)}
        </button>
      </div>
    </div>
  );
}

/**
 * Menu row: the thumbnail grows from nothing while unwinding from a slight
 * spin, and the label rises out of its own clip — no opacity fades.
 */
export function MorphMenuItem({
  index,
  onClick,
  thumb,
  label,
  active,
}: {
  index: number;
  onClick: () => void;
  /** optional tile that spins in; rows without one are text-only */
  thumb?: ReactNode;
  label: ReactNode;
  active: boolean;
}) {
  const { open } = useContext(MorphMenuContext);
  return (
    <li>
      <button
        type="button"
        tabIndex={open ? undefined : -1}
        onClick={onClick}
        className={cn(
          "flex w-full items-center text-left transition-colors duration-200 hover:bg-white/10",
          "rounded-[0.75rem]",
          thumb ? "gap-4 p-1" : "gap-3 px-2.5 py-2",
        )}
      >
        {thumb && (
          <span
            className={cn(
              "relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-[0.5rem] bg-cream text-charcoal transition-transform duration-[700ms]",
              EASE,
              open ? cn("rotate-0 scale-100", THUMB_DELAYS[index]) : "-rotate-[35deg] scale-0 delay-0",
            )}
          >
            {thumb}
          </span>
        )}
        <span className="flex-1 overflow-hidden whitespace-nowrap py-[0.15em] font-display text-base font-bold leading-none">
          <span
            className={cn(
              "block transition-transform duration-[650ms]",
              EASE,
              open ? cn("translate-y-0", TEXT_DELAYS[index]) : "translate-y-[110%] delay-0",
            )}
          >
            {label}
          </span>
        </span>
        <span
          className={cn(
            "mr-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current transition-transform duration-300",
            open && active ? "scale-100 delay-300" : "scale-0 delay-0",
          )}
        />
      </button>
    </li>
  );
}
