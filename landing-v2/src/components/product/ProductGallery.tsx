"use client";

import { useState } from "react";
import { ImageOff, ZoomIn } from "lucide-react";
import { LoadingImage } from "@/components/LoadingImage";
import { ProductLightbox } from "@/components/ProductLightbox";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";
import type { CatalogProduct } from "@/data/products";

/**
 * Compact product gallery: one 2:3 photo like the catalog cards, fitted
 * whole (never cropped), and a row of thumbnails to switch it.
 * Clicking the photo opens it in the zoomable lightbox.
 */
export function ProductGallery({ product }: { product: CatalogProduct }) {
  const c = useI18n().t.catalog;
  const [index, setIndex] = useState(0);
  const [zoom, setZoom] = useState(false);
  const count = product.images.length;

  if (count === 0) {
    return (
      <div className="flex aspect-[2/3] w-full max-w-[min(100%,calc(72svh*2/3))] items-center lg:w-[min(34rem,calc(72svh*2/3))] lg:max-w-none justify-center rounded-2xl bg-[#e6e1d8] text-charcoal/30">
        <ImageOff className="size-12" strokeWidth={1.25} />
      </div>
    );
  }

  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <button
        type="button"
        aria-label={`${c.zoomIn}: ${c.photo(product.name, index + 1)}`}
        onClick={() => setZoom(true)}
        className="group relative block aspect-[2/3] w-full max-w-[min(100%,calc(72svh*2/3))] cursor-zoom-in lg:w-[min(34rem,calc(72svh*2/3))] lg:max-w-none overflow-hidden rounded-2xl bg-[#e6e1d8]"
      >
        <LoadingImage
          key={product.images[index]}
          src={product.images[index]}
          alt={c.photo(product.name, index + 1)}
          fill
          sizes="(max-width: 1024px) 92vw, 34rem"
          loading="eager"
          fetchPriority={index === 0 ? "high" : "auto"}
          className="object-contain transition-transform duration-[1200ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.03]"
        />
        <span className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-full bg-cream/85 text-charcoal opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <ZoomIn className="size-5" />
        </span>
      </button>


      {/* Padded (and pulled back by the same amount) so the scroll box doesn't
          clip the active thumbnail's offset ring */}
      {count > 1 && (
        <ul className="q-no-scrollbar -mx-1 mt-2 flex max-w-[calc(100%+0.5rem)] gap-2 overflow-x-auto p-1 lg:w-[calc(min(34rem,calc(72svh*2/3))+0.5rem)]">
          {product.images.map((src, i) => (
            <li key={src + i} className="shrink-0">
              <button
                type="button"
                aria-label={c.photoN(i + 1)}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "relative block aspect-[2/3] w-12 overflow-hidden rounded-lg bg-[#e6e1d8] transition-opacity duration-300 md:w-14",
                  i === index ? "ring-2 ring-charcoal ring-offset-2 ring-offset-cream" : "opacity-55 hover:opacity-100",
                )}
              >
                <LoadingImage src={src} alt="" fill sizes="72px" className="object-contain" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {zoom && (
        <ProductLightbox
          product={product}
          index={index}
          onIndexChange={setIndex}
          onClose={() => setZoom(false)}
        />
      )}
    </div>
  );
}
