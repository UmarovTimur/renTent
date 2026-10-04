"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Download, ImageOff, Search, X } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { AddToCartBadge } from "@/components/cart/AddToCart";
import { cn } from "@/lib/utils";
import { fuzzySearch } from "@/lib/search";
import { useI18n } from "@/i18n/I18nProvider";
import { productHref } from "@/i18n/config";
import { CATEGORIES, type CatalogCategory, type CatalogProduct } from "@/data/products";
import { formatNumber } from "@/lib/intl";


export function ProductCatalog({ products }: { products: CatalogProduct[] }) {
  const t = useI18n().t.catalog;
  const [category, setCategory] = useState<CatalogCategory | "all">("all");
  const [query, setQuery] = useState("");
  const inCategory = category === "all" ? products : products.filter((p) => p.category === category);
  const visible = fuzzySearch(inCategory, query, (p) => `${p.name} ${p.description} ${t.categories[p.category]}`);
  // Once the list has been filtered, cards show right away instead of waiting
  // to be scrolled into view (the grid shrinks and the page scroll jumps)
  const [filtered, setFiltered] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const select = (c: CatalogCategory | "all") => {
    setCategory(c);
    setFiltered(true);
    // the grid gets shorter; bring the filter back into view if the page scrolled past it
    const el = filterRef.current;
    if (el && el.getBoundingClientRect().top < 80) {
      el.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  };
  const options = ["all", ...CATEGORIES] as const;

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

        <div
          ref={filterRef}
          className="mt-[clamp(1.5rem,3vw,2.5rem)] flex scroll-mt-24 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
        >
          {/* min-w-0 + the right side not shrinking: with longer labels (Uzbek)
              the chips wrap instead of pushing the search off the edge */}
          <div role="group" aria-label={t.filterLabel} className="flex min-w-0 flex-wrap gap-2">
          {options.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={category === c}
              onClick={() => select(c)}
              className={cn(
                "rounded-full border px-4 py-1.5 font-text text-[0.85rem] transition-colors duration-200 sm:text-[0.95rem]",
                category === c ? "border-charcoal bg-charcoal text-cream" : "border-charcoal/25 hover:border-charcoal/60",
              )}
            >
              {t.categories[c]}
            </button>
          ))}
          </div>

          <div className="flex items-center gap-2 lg:shrink-0">
            <FullPriceButton />
            <label className="relative flex min-w-0 flex-1 items-center lg:w-[18rem] lg:flex-none">
              <span className="sr-only">{t.search}</span>
              <Search aria-hidden className="pointer-events-none absolute left-4 size-4 text-charcoal/50" />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setFiltered(true);
                }}
                placeholder={t.searchPlaceholder}
                className="w-full rounded-full border border-charcoal/25 bg-transparent py-2 pl-10 pr-10 font-text text-[0.95rem] outline-none transition-colors placeholder:text-charcoal/45 hover:border-charcoal/60 focus:border-charcoal [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  aria-label={t.clearSearch}
                  onClick={() => setQuery("")}
                  className="absolute right-2 flex size-7 items-center justify-center rounded-full text-charcoal/60 transition-colors hover:bg-charcoal hover:text-cream"
                >
                  <X className="size-4" />
                </button>
              )}
            </label>
          </div>
        </div>

        {visible.length === 0 && (
          <div className="flex min-h-[50svh] flex-col items-center justify-center text-balance text-center">
            <p className="font-display text-[clamp(2rem,5vw,4.5rem)] font-medium leading-none tracking-[-0.02em]">
              {t.nothingFound}
            </p>
            <p className="mt-4 font-text text-[clamp(0.95rem,1.1vw,1.15rem)] text-charcoal/60">{t.nothingFoundHint}</p>
          </div>
        )}

        <div
          className="mt-[clamp(1.5rem,3vw,2.5rem)] grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-[clamp(1rem,2vw,2rem)] sm:gap-y-[clamp(2rem,3vw,3rem)] lg:grid-cols-4">
          {visible.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              delay={((i % 3) + 1) as 1 | 2 | 3}
              immediate={filtered}
            />
          ))}
        </div>
      </div>

    </section>
  );
}

function ProductCard({
  product,
  delay,
  immediate,
}: {
  product: CatalogProduct;
  delay: 1 | 2 | 3;
  immediate: boolean;
}) {
  const {
    locale,
    t: { catalog: t, intl },
  } = useI18n();
  const router = useRouter();
  const href = productHref(locale, product.slug);
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
    <Reveal delay={delay} immediate={immediate} className="group flex flex-col">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-[#dcd7ce] sm:rounded-[1.25rem]">
        <AddToCartBadge product={product} className="absolute right-2 top-2 z-10 sm:right-3 sm:top-3" />
        {product.images.map((src, i) =>
          mounted.has(i) || i === next ? (
            <Image
              key={src + i}
              src={src}
              alt={t.photo(product.name, i + 1)}
              fill
              sizes="(max-width: 1024px) 48vw, 23vw"
              onLoad={() => setLoaded((l) => new Set(l).add(i))}
              className={cn(
                "cursor-pointer object-cover transition-opacity duration-500",
                i === index ? "opacity-100" : "opacity-0",
              )}
              // The photo opens the page too; the title below is the real link
              onClick={() => router.push(href)}
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
          <Link href={href} className="underline-offset-4 hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="whitespace-nowrap font-text text-[0.8rem] tabular-nums sm:text-[clamp(0.95rem,1.2vw,1.15rem)]">
          {formatNumber(intl, product.price)} {t.currency}
          {product.priceNote && <span className="ml-1 text-charcoal/55">/ {product.priceNote}</span>}
        </p>
      </div>
    </Reveal>
  );
}

const PRICE_LIST = "/images/full-price-list.jpg";

/**
 * The whole price list as one picture: shared through the system sheet on
 * phones that can share files (to send it on in Telegram etc.), downloaded
 * everywhere else.
 */
function FullPriceButton() {
  const t = useI18n().t.catalog;

  const download = () => {
    const a = document.createElement("a");
    a.href = PRICE_LIST;
    a.download = "full-price-list.jpg";
    a.click();
  };

  const onClick = async () => {
    if (!window.matchMedia("(pointer: coarse)").matches || !navigator.canShare) return download();
    try {
      const blob = await (await fetch(PRICE_LIST)).blob();
      const file = new File([blob], "full-price-list.jpg", { type: blob.type });
      if (!navigator.canShare({ files: [file] })) return download();
      await navigator.share({ files: [file], title: t.fullPrice });
    } catch (e) {
      // Closing the share sheet isn't a failure
      if (!(e instanceof DOMException && e.name === "AbortError")) download();
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex shrink-0 items-center gap-2 rounded-full bg-charcoal px-4 py-2 font-display text-[0.95rem] font-medium text-cream transition-opacity duration-200 hover:opacity-80"
    >
      <Download aria-hidden className="size-4" />
      {t.fullPrice}
    </button>
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
