"use client";

import { useCallback, useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import { getImageProps } from "next/image";
import { LoadingImage } from "@/components/LoadingImage";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";
import type { CatalogProduct } from "@/data/products";

const ZOOM = 2.4;
const LIGHTBOX_SIZES = "85vw";
const SCROLL_KEYS = new Set([" ", "PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown"]);

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
  const [zoomed, setZoomed] = useState(false);
  const lenis = useLenis();
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const count = product.images.length;

  const go = useCallback(
    (step: number) => {
      setZoomed(false);
      onIndexChange((index + step + count) % count);
    },
    [count, index, onIndexChange],
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

  const trackPointer = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black/85 p-4 backdrop-blur-xl"
      onClick={onClose}
    >
      <ControlButton label={t.close} onClick={onClose} className="absolute right-4 top-4 z-10">
        <X className="size-5" />
      </ControlButton>

      <div
        className="relative aspect-[3/4] w-full max-w-[min(85vw,calc(80vh*3/4))] overflow-hidden rounded-2xl bg-charcoal"
        onClick={(e) => e.stopPropagation()}
        onMouseMove={trackPointer}
      >
        <LoadingImage
          key={product.images[index]}
          src={product.images[index]}
          alt={t.photo(product.name, index + 1)}
          fill
          sizes={LIGHTBOX_SIZES}
          loading="eager"
          fetchPriority="high"
          skeletonClassName="[--q-shimmer-bg:var(--color-charcoal)] [--q-shimmer-glow:rgb(255_255_255/0.08)]"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setOrigin({
              x: ((e.clientX - rect.left) / rect.width) * 100,
              y: ((e.clientY - rect.top) / rect.height) * 100,
            });
            setZoomed((z) => !z);
          }}
          className={cn(
            "object-cover transition-transform duration-300 ease-out",
            zoomed ? "cursor-zoom-out" : "cursor-zoom-in",
          )}
          style={{
            transform: `scale(${zoomed ? ZOOM : 1})`,
            transformOrigin: `${origin.x}% ${origin.y}%`,
          }}
        />
      </div>

      {/* Controls: icons only — prev, one dot per photo, next, zoom */}
      <div
        className="flex items-center gap-1 rounded-full bg-white/10 p-1 text-white"
        onClick={(e) => e.stopPropagation()}
      >
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
                    setZoomed(false);
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
        <ControlButton label={zoomed ? t.zoomOut : t.zoomIn} className="bg-transparent" onClick={() => setZoomed((z) => !z)}>
          {zoomed ? <ZoomOut className="size-5" /> : <ZoomIn className="size-5" />}
        </ControlButton>
      </div>
    </div>
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
