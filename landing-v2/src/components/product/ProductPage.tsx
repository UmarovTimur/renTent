import Image from "next/image";
import Link from "next/link";
import { Check, Download } from "lucide-react";
import { AddToCart } from "@/components/cart/AddToCart";
import { CtaSection } from "@/components/CtaSection";
import { HandArrowSmall } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductTopBar } from "@/components/product/ProductTopBar";
import { productHref, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import type { CatalogCategory, CatalogProduct } from "@/data/products";

// Content width of the product details (the bands below run edge to edge, like the home page)
const CONTAINER = "mx-auto w-full max-w-[80rem] px-4 md:px-8";

// Wide outdoor shot for the full-bleed mood band, picked by category
const MOOD_PHOTO: Record<CatalogCategory, string> = {
  tents: "/images/intro/wide.jpg",
  camp: "/images/intro/wide.jpg",
  trekking: "/images/cover.jpg",
  kitchen: "/images/versatility.jpg",
  light: "/images/versatility.jpg",
};

/**
 * Product page: a compact sticky gallery on the left (photos fitted whole,
 * opening the zoomable lightbox), price, booking and how-to videos on the
 * right (within a fixed content width), then related gear and a full-bleed
 * mountain band across the whole screen.
 */
export function ProductPage({
  locale,
  product,
  related,
}: {
  locale: Locale;
  product: CatalogProduct;
  related: CatalogProduct[];
}) {
  const dict = getDictionary(locale);
  const t = dict.product;
  const c = dict.catalog;
  const price = (p: CatalogProduct) => `${new Intl.NumberFormat(dict.intl).format(p.price)} ${c.currency}`;

  return (
    <>
      <ProductTopBar product={product} />
      <main className="bg-cream text-charcoal">
        <section className={`${CONTAINER} pb-16 pt-24 md:pb-[12vh] md:pt-28`}>
          {/* The gallery column is exactly as wide as its photo, the text takes the rest */}
          <div className="grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-[clamp(2rem,4vw,4rem)]">
            <ProductGallery product={product} />

            <div>
              <p className="font-text text-sm uppercase tracking-[0.12em] text-charcoal/55">
                {c.categories[product.category]}
              </p>
              <h1 className="mt-3 font-display text-[clamp(2.4rem,5vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
                {product.name}
              </h1>
              <p className="mt-5 font-display text-[clamp(1.4rem,2vw,2rem)] tabular-nums">
                {price(product)}
                <span className="ml-2 text-charcoal/50">/ {product.priceNote ?? c.perDay}</span>
              </p>
              <p className="mt-6 max-w-[32rem] font-text text-[clamp(1rem,1.15vw,1.15rem)] leading-relaxed text-charcoal/75">
                {product.description}
              </p>

              {/* Cart: the button with a handwritten nudge pointing at it */}
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                <AddToCart product={product} />
                <span className="q-hand flex items-center gap-1 text-[1.6rem] leading-none">
                  <HandArrowSmall className="h-9 w-8 -scale-x-100 rotate-[200deg]" />
                  <span className="-rotate-3">{t.note}</span>
                </span>
              </div>

              <ul className="mt-10 flex flex-col border-t border-charcoal/15">
                {t.perks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-start gap-3 border-b border-charcoal/15 py-4 font-text text-[0.95rem] text-charcoal/80"
                  >
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0" strokeWidth={2.5} />
                    {perk}
                  </li>
                ))}
              </ul>

              {product.videos && product.videos.length > 0 && (
                <section className="mt-10">
                  <h2 className="font-display text-xl font-medium">{c.videos}</h2>
                  <ul className="mt-4 flex flex-col gap-6">
                    {product.videos.map((video) => (
                      <li key={video.src} className="flex flex-col gap-3">
                        <video
                          src={video.src}
                          controls
                          playsInline
                          preload="metadata"
                          className="aspect-video w-full rounded-2xl bg-charcoal object-contain"
                        />
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-text text-[0.95rem]">{video.title}</span>
                          <a
                            href={video.src}
                            download
                            className="flex shrink-0 items-center gap-2 rounded-full border border-charcoal/25 px-4 py-2 font-text text-sm transition-colors hover:bg-charcoal hover:text-cream"
                          >
                            <Download aria-hidden className="size-4" />
                            {c.downloadVideo}
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="px-4 py-16 md:px-[1.6rem] md:py-[12vh]">
            <Reveal as="h2" className="font-display text-[clamp(2rem,4vw,3.75rem)] font-semibold leading-none tracking-[-0.02em]">
              {t.related}
            </Reveal>
            <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-[clamp(1rem,2vw,2rem)] lg:grid-cols-4">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
                  <Link href={productHref(locale, p.slug)} className="group flex flex-col">
                    <span className="relative aspect-[2/3] overflow-hidden rounded-xl bg-[#dcd7ce] sm:rounded-[1.25rem]">
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        sizes="(max-width: 1024px) 48vw, 23vw"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.04]"
                      />
                    </span>
                    <span className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                      <span className="font-display text-[0.95rem] font-medium leading-tight sm:text-[clamp(1.05rem,1.4vw,1.35rem)]">
                        {p.name}
                      </span>
                      <span className="whitespace-nowrap font-text text-[0.8rem] tabular-nums sm:text-[clamp(0.95rem,1.2vw,1.15rem)]">
                        {price(p)}
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Full-bleed mood band */}
        <section data-header-theme="dark" className="relative flex min-h-[80svh] items-end justify-center overflow-hidden text-center text-cream">
          <Image src={MOOD_PHOTO[product.category]} alt="" fill sizes="100vw" className="object-cover" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/5" />
          <div className="relative flex w-full flex-col items-center px-4 pb-[clamp(2rem,8vh,5rem)] md:px-[1.6rem]">
            <Reveal as="h2" className="font-display text-[clamp(3rem,10vw,10rem)] font-semibold leading-[0.88] tracking-[-0.04em]">
              {t.moodTitle}
            </Reveal>
            <Reveal as="p" delay={1} className="mt-5 max-w-[34rem] text-balance font-text text-[clamp(1rem,1.3vw,1.3rem)] leading-snug text-cream/85">
              {t.moodLead}
            </Reveal>
          </div>
        </section>

        <CtaSection locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
