"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLenis } from "lenis/react";
import { getImageProps } from "next/image";
import { LoadingImage } from "@/components/LoadingImage";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";
import type { CatalogProduct } from "@/data/products";

const LIGHTBOX_SIZES = "85vw";
const SCROLL_KEYS = new Set([" ", "PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown"]);

// Zoom limits; a pinch may overshoot them a little and springs back on release
const MIN_SCALE = 1;
const MAX_SCALE = 5;
const DOUBLE_TAP_SCALE = 2.5;
// Gesture thresholds (px / ms)
const TAP_SLOP = 10;
const DOUBLE_TAP_MS = 300;
const SWIPE_MIN = 60;

interface View {
  s: number; // scale
  x: number; // translation of the stage layer, px
  y: number;
}
interface Point {
  x: number;
  y: number;
}

const IDENTITY: View = { s: 1, x: 0, y: 0 };
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const dist = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const mid = (a: Point, b: Point) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

/** Warms the browser cache with the neighbouring photos, at the same
 *  optimized size the lightbox will ask for, so flipping is instant. */
function prefetchPhotos(srcs: string[]) {
  for (const src of srcs) {
    const { props } = getImageProps({ src, alt: "", fill: true, sizes: LIGHTBOX_SIZES });
    const img = new window.Image();
    img.sizes = props.sizes ?? LIGHTBOX_SIZES;
    if (props.srcSet) img.srcset = props.srcSet;
    img.src = props.src;
  }
}

/**
 * Full-screen photo viewer that zooms like a native one: pinch with two
 * fingers, wheel / trackpad scroll at the cursor, double tap / double click
 * to zoom in at that spot (and back out), drag to pan while zoomed. Not
 * zoomed, a horizontal swipe flips photos and a tap beside the photo closes.
 */
export function ProductLightbox({
  product,
  index,
  onIndexChange,
  onClose,
}: {
  product: CatalogProduct;
  index: number;
  onIndexChange: (next: number) => void;
  onClose: () => void;
}) {
  const t = useI18n().t.catalog;
  const lenis = useLenis();
  const count = product.images.length;

  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [view, setViewState] = useState<View>(IDENTITY);
  // Eased moves (double tap, buttons, spring-back); live gestures follow the fingers 1:1
  const [animate, setAnimate] = useState(false);
  const [dragging, setDragging] = useState(false);
  const viewRef = useRef<View>(IDENTITY);
  const zoomed = view.s > 1.01;

  const setView = useCallback((next: View, eased = false) => {
    viewRef.current = next;
    setAnimate(eased);
    setViewState(next);
  }, []);

  /** Keeps the photo covering the screen when it is bigger than it, and
   *  inside the screen when smaller, so it can never be lost off an edge. */
  const fit = useCallback((v: View): View => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    if (v.s <= MIN_SCALE) return IDENTITY;
    if (!stage || !frame) return v;
    const axis = (pos: number, frameStart: number, frameSize: number, stageSize: number) => {
      const a = -v.s * frameStart;
      const b = stageSize - v.s * (frameStart + frameSize);
      return clamp(pos, Math.min(a, b), Math.max(a, b));
    };
    return {
      s: v.s,
      x: axis(v.x, frame.offsetLeft, frame.offsetWidth, stage.clientWidth),
      y: axis(v.y, frame.offsetTop, frame.offsetHeight, stage.clientHeight),
    };
  }, []);

  /** Scale to `s` keeping the stage point `at` (stage px) under the same spot. */
  const zoomAt = useCallback(
    (s: number, at: Point, from: View = viewRef.current): View => {
      const k = s / from.s;
      return { s, x: at.x - (at.x - from.x) * k, y: at.y - (at.y - from.y) * k };
    },
    [],
  );

  const stageCenter = () => {
    const stage = stageRef.current;
    return { x: (stage?.clientWidth ?? 0) / 2, y: (stage?.clientHeight ?? 0) / 2 };
  };

  const toggleZoom = useCallback(
    (at: Point) => {
      if (viewRef.current.s > 1.01) setView(IDENTITY, true);
      else setView(fit(zoomAt(DOUBLE_TAP_SCALE, at, IDENTITY)), true);
    },
    [fit, setView, zoomAt],
  );

  const go = useCallback(
    (step: number) => {
      setView(IDENTITY);
      onIndexChange((index + step + count) % count);
    },
    [count, index, onIndexChange, setView],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      // The page behind stays put: no keyboard scrolling either.
      if (SCROLL_KEYS.has(e.key)) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  // Freeze the page behind through Lenis (it swallows wheel and touch while
  // stopped) instead of overflow: hidden, which hid the scrollbar and left
  // Chrome with a stale, half-painted one afterwards.
  useEffect(() => {
    lenis?.stop();
    return () => lenis?.start();
  }, [lenis]);

  useEffect(() => {
    if (count < 2) return;
    prefetchPhotos([product.images[(index + 1) % count], product.images[(index - 1 + count) % count]]);
  }, [count, index, product.images]);

  // A rotated phone or resized window re-fits the photo
  useEffect(() => {
    const onResize = () => setView(fit(viewRef.current));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [fit, setView]);

  // Wheel / trackpad zooms at the cursor (a trackpad pinch arrives as
  // ctrl + wheel, with finer steps). Native listener: React's is passive.
  // Safari's own pinch gesture events are cancelled so the page never zooms.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = stage.getBoundingClientRect();
      const at = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      const s = clamp(viewRef.current.s * Math.exp(-delta * (e.ctrlKey ? 0.01 : 0.002)), MIN_SCALE, MAX_SCALE);
      setView(s <= MIN_SCALE ? IDENTITY : fit(zoomAt(s, at)));
    };
    const cancel = (e: Event) => e.preventDefault();
    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("gesturestart", cancel);
    stage.addEventListener("gesturechange", cancel);
    return () => {
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("gesturestart", cancel);
      stage.removeEventListener("gesturechange", cancel);
    };
  }, [fit, setView, zoomAt]);

  // ---- Pointer gestures: one pointer pans (or swipes), two pinch ----
  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef<{
    start: View;
    // one pointer
    origin: Point;
    downAt: number;
    moved: boolean;
    // two pointers
    pinchDist: number;
    pinchMid: Point;
    pinched: boolean;
  } | null>(null);
  const lastTap = useRef<{ at: Point; time: number } | null>(null);

  const local = (e: React.PointerEvent): Point => {
    const rect = stageRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const beginGesture = () => {
    const pts = [...pointers.current.values()];
    const g = gesture.current;
    gesture.current = {
      start: viewRef.current,
      origin: pts[0],
      downAt: g?.downAt ?? performance.now(),
      moved: g?.moved ?? false,
      pinchDist: pts.length > 1 ? dist(pts[0], pts[1]) : 0,
      pinchMid: pts.length > 1 ? mid(pts[0], pts[1]) : pts[0],
      pinched: (g?.pinched ?? false) || pts.length > 1,
    };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    // Keep receiving moves when a finger or the mouse leaves the stage
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // pointer already gone
    }
    if (pointers.current.size === 0) gesture.current = null;
    pointers.current.set(e.pointerId, local(e));
    beginGesture();
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, local(e));
    const g = gesture.current;
    if (!g) return;
    const pts = [...pointers.current.values()];

    if (pts.length > 1) {
      // Pinch: scale by the finger spread around their midpoint, which also pans
      const m = mid(pts[0], pts[1]);
      const s = clamp((g.start.s * dist(pts[0], pts[1])) / (g.pinchDist || 1), MIN_SCALE * 0.75, MAX_SCALE * 1.25);
      const k = s / g.start.s;
      g.moved = true;
      setView({ s, x: m.x - (g.pinchMid.x - g.start.x) * k, y: m.y - (g.pinchMid.y - g.start.y) * k });
      return;
    }

    const dx = pts[0].x - g.origin.x;
    const dy = pts[0].y - g.origin.y;
    if (!g.moved && Math.hypot(dx, dy) < TAP_SLOP) return;
    g.moved = true;
    if (g.start.s > 1.01) setView(fit({ s: g.start.s, x: g.start.x + dx, y: g.start.y + dy }));
    // Not zoomed: the photo follows a sideways swipe (only when there is another to flip to)
    else if (count > 1 && !g.pinched) setView({ s: 1, x: dx, y: 0 });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    const end = local(e);
    pointers.current.delete(e.pointerId);
    const g = gesture.current;
    if (pointers.current.size > 0) {
      // One finger of a pinch lifted: carry on panning with the other
      beginGesture();
      return;
    }
    setDragging(false);
    if (!g) return;
    const v = viewRef.current;

    if (g.pinched) {
      // Spring back inside the limits
      if (v.s <= MIN_SCALE) setView(IDENTITY, true);
      else if (v.s > MAX_SCALE) setView(fit(zoomAt(MAX_SCALE, stageCenter())), true);
      else setView(fit(v), true);
      return;
    }

    if (g.moved) {
      if (g.start.s <= 1.01) {
        const dx = end.x - g.origin.x;
        if (count > 1 && Math.abs(dx) > SWIPE_MIN) go(dx < 0 ? 1 : -1);
        else setView(IDENTITY, true);
      }
      return;
    }

    if (e.type === "pointercancel") return;
    // A tap: two in a row toggle the zoom there; a single one beside the photo closes
    const now = performance.now();
    const prev = lastTap.current;
    if (prev && now - prev.time < DOUBLE_TAP_MS && dist(prev.at, end) < TAP_SLOP * 3) {
      lastTap.current = null;
      toggleZoom(end);
      return;
    }
    lastTap.current = { at: end, time: now };
    if (v.s <= 1.01 && !onPhoto(end, v)) onClose();
  };

  /** Whether a stage point lands on the photo frame at the given view. */
  const onPhoto = (p: Point, v: View) => {
    const frame = frameRef.current;
    if (!frame) return false;
    const x = (p.x - v.x) / v.s;
    const y = (p.y - v.y) / v.s;
    return (
      x >= frame.offsetLeft &&
      x <= frame.offsetLeft + frame.offsetWidth &&
      y >= frame.offsetTop &&
      y <= frame.offsetTop + frame.offsetHeight
    );
  };

  // Portaled to <body>: rendered in place, a positioned/sticky ancestor's
  // stacking context would trap its z-index under the rest of the page.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-xl"
    >
      {/* Gesture surface: the whole screen, so a zoomed photo can fill it */}
      <div
        ref={stageRef}
        data-lenis-prevent
        className={cn(
          "absolute inset-0 touch-none select-none overflow-hidden",
          zoomed ? (dragging ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in",
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className={cn(
            "absolute inset-0 flex origin-top-left items-center justify-center px-4 pb-24 pt-16 will-change-transform",
            animate && "transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)]",
          )}
          style={{ transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.s})` }}
        >
          <div
            ref={frameRef}
            className={cn(
              "relative aspect-[2/3] w-full max-w-[min(85vw,calc((100svh-10rem)*2/3))] overflow-hidden bg-charcoal transition-[border-radius] duration-300",
              zoomed ? "rounded-none" : "rounded-2xl",
            )}
          >
            <LoadingImage
              key={product.images[index]}
              src={product.images[index]}
              alt={t.photo(product.name, index + 1)}
              fill
              sizes={LIGHTBOX_SIZES}
              loading="eager"
              fetchPriority="high"
              draggable={false}
              skeletonClassName="[--q-shimmer-bg:var(--color-charcoal)] [--q-shimmer-glow:rgb(255_255_255/0.08)]"
              // Whole photo, never cropped
              className="pointer-events-none object-contain"
            />
          </div>
        </div>
      </div>

      <ControlButton label={t.close} onClick={onClose} className="absolute right-4 top-4 z-10">
        <X className="size-5" />
      </ControlButton>

      {/* Controls: icons only — prev, one dot per photo, next, zoom */}
      <div className="absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-10 flex justify-center">
        <div className="flex items-center gap-1 rounded-full bg-white/10 p-1 text-white backdrop-blur-md">
          {count > 1 && (
            <>
              <ControlButton label={t.prev} className="bg-transparent" onClick={() => go(-1)}>
                <ChevronLeft className="size-5" />
              </ControlButton>
              <div className="flex items-center gap-1.5 px-2">
                {product.images.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    aria-label={t.photoN(i + 1)}
                    aria-current={i === index}
                    onClick={() => {
                      setView(IDENTITY);
                      onIndexChange(i);
                    }}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === index ? "w-5 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70",
                    )}
                  />
                ))}
              </div>
              <ControlButton label={t.next} className="bg-transparent" onClick={() => go(1)}>
                <ChevronRight className="size-5" />
              </ControlButton>
              <span aria-hidden className="mx-1 h-5 w-px bg-white/20" />
            </>
          )}
          <ControlButton
            label={zoomed ? t.zoomOut : t.zoomIn}
            className="bg-transparent"
            onClick={() => toggleZoom(stageCenter())}
          >
            {zoomed ? <ZoomOut className="size-5" /> : <ZoomIn className="size-5" />}
          </ControlButton>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function ControlButton({
  label,
  onClick,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white hover:text-charcoal",
        className,
      )}
    >
      {children}
    </button>
  );
}
