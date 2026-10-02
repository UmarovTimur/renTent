"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ProductLightbox } from "@/components/ProductLightbox";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";
import type { CatalogProduct } from "@/data/products";


export function ProductCatalog({ products }: { products: CatalogProduct[] }) {
  const t = useI18n().t.catalog;
  const [lightbox, setLightbox] = useState<{ product: CatalogProduct; index: number } | null>(null);

  return (
    <section
      id="catalog"
      data-header-theme="light"
      className="bg-cream py-12 text-charcoal md:py-[10vh]"
    >
      <div className="q-container">
        <Reveal as="h2" className="font-display text-[clamp(2.5rem,5.5vw,5rem)] font-semibold leading-none tracking-[-0.02em]">
          {t.title}
        </Reveal>
        <p className="mt-3 max-w-[34rem] font-text text-[clamp(0.95rem,1.1vw,1.15rem)] text-charcoal/70">
          {t.subtitle}
        </p>

        <div className="mt-[clamp(2rem,4vw,3.5rem)] grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-[clamp(1rem,2vw,2rem)] sm:gap-y-[clamp(2rem,3vw,3rem)] lg:grid-cols-3">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              delay={((i % 3) + 1) as 1 | 2 | 3}
              onZoom={(index) => setLightbox({ product, index })}
            />
          ))}
        </div>
      </div>

      {lightbox && (
        <ProductLightbox
          product={lightbox.product}
          index={lightbox.index}
          onIndexChange={(index) => setLightbox((s) => (s ? { ...s, index } : s))}
          onClose={() => setLightbox(null)}
        />
      )}
    </section>
  );
}

function ProductCard({
  product,
  delay,
  onZoom,
}: {
  product: CatalogProduct;
  delay: 1 | 2 | 3;
  onZoom: (index: number) => void;
}) {
  const {
    t: { catalog: t, intl },
  } = useI18n();
  const [index, setIndex] = useState(0);
  // Photos fetched so far (shown ones stay mounted so the cross-fade works)
  // and photos that finished loading. Only the current photo and the next
  // one are requested, not the whole gallery of every card.
  const [mounted, setMounted] = useState(() => new Set([0]));
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set());
  const count = product.images.length;
  const show = (next: number) => {
    setIndex(next);
    setMounted((m) => new Set(m).add(next));
  };
  const go = (step: number) => show((index + step + count) % count);
  const next = (index + 1) % count;

  return (
    <Reveal delay={delay} className="group flex flex-col">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-[#dcd7ce] sm:rounded-[1.25rem]">
        {product.images.map((src, i) =>
          mounted.has(i) || i === next ? (
            <Image
              key={src + i}
              src={src}
              alt={t.photo(product.name, i + 1)}
              fill
              sizes="(max-width: 1024px) 48vw, 31vw"
              onLoad={() => setLoaded((l) => new Set(l).add(i))}
              className={cn(
                "cursor-zoom-in object-cover transition-opacity duration-500",
                i === index ? "opacity-100" : "opacity-0",
              )}
              onClick={() => onZoom(i)}
            />
          ) : null,
        )}
        {count > 0 ? (
          <span
            aria-hidden
            className={cn(
              "q-shimmer pointer-events-none absolute inset-0 transition-opacity duration-500",
              loaded.has(index) && "opacity-0",
            )}
          />
        ) : (
          // No photo yet: a quiet placeholder instead of an endless skeleton
          <span aria-hidden className="absolute inset-0 flex items-center justify-center text-charcoal/30">
            <ImageOff className="size-10" strokeWidth={1.25} />
          </span>
        )}

        {count > 1 && (
          <>
            <CardArrow direction="prev" onClick={() => go(-1)} />
            <CardArrow direction="next" onClick={() => go(1)} />
            <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
              {product.images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  aria-label={t.photoN(i + 1)}
                  onClick={() => show(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === index ? "w-5 bg-cream" : "w-1.5 bg-cream/55 hover:bg-cream/80",
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-2.5 flex flex-col gap-1 sm:mt-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
        <h3 className="font-display text-[0.95rem] font-medium leading-tight sm:text-[clamp(1.05rem,1.4vw,1.35rem)]">
          {product.name}
        </h3>
        <p className="whitespace-nowrap font-text text-[0.8rem] tabular-nums sm:text-[clamp(0.95rem,1.2vw,1.15rem)]">
          {new Intl.NumberFormat(intl).format(product.price)} {t.currency}
          {product.priceNote && <span className="ml-1 text-charcoal/55">/ {product.priceNote}</span>}
        </p>
      </div>
    </Reveal>
  );
}

function CardArrow({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const t = useI18n().t.catalog;
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? t.prev : t.next}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-cream/85 text-charcoal opacity-0 transition-opacity duration-200 hover:bg-cream focus-visible:opacity-100 group-hover:opacity-100",
        direction === "prev" ? "left-3" : "right-3",
      )}
    >
      {direction === "prev" ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
    </button>
  );
}
