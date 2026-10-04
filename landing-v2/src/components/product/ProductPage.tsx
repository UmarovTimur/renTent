import Image from "next/image";
import { Check, Download } from "lucide-react";
import { AddToCart } from "@/components/cart/AddToCart";
import { CtaSection } from "@/components/CtaSection";
import { ProductCatalog } from "@/components/ProductCatalog";
import { HandArrowSmall } from "@/components/icons";
import { Reveal } from "@/components/Reveal";
import { SiteFooter } from "@/components/SiteFooter";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductTopBar } from "@/components/product/ProductTopBar";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import type { CatalogCategory, CatalogProduct } from "@/data/products";
import { formatNumber } from "@/lib/intl";

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
 * right (within a fixed content width), then the rest of the catalog (the
 * home page's filterable grid) and a full-bleed mountain band across the
 * whole screen.
 */
export function ProductPage({
  locale,
  product,
  others,
}: {
  locale: Locale;
  product: CatalogProduct;
  /** every other product in the catalog */
  others: CatalogProduct[];
}) {
  const dict = getDictionary(locale);
  const t = dict.product;
  const c = dict.catalog;
  const price = (p: CatalogProduct) => `${formatNumber(dict.intl, p.price)} ${c.currency}`;

  return (
    <>
      <ProductTopBar product={product} />
      <main className="bg-cream text-charcoal">
        <section className={`${CONTAINER} pb-16 pt-24 md:pb-[12vh] md:pt-28`}>
          {/* The gallery column is exactly as wide as its photo, the text takes the rest */}
          <div className="grid gap-6 md:gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-[clamp(2rem,4vw,4rem)]">
            <ProductGallery product={product} />

            {/* Vertical rhythm: tight inside a group (category, name, price),
                wider between groups (description, cart, perks, videos) */}
            <div>
              <p className="font-text text-sm uppercase leading-none tracking-[0.12em] text-charcoal/55">
                {c.categories[product.category]}
              </p>
              <h1 className="mt-2.5 font-display md:mt-3 text-[clamp(2.4rem,5vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.03em]">
                {product.name}
              </h1>
              <p className="mt-3 font-display text-[clamp(1.4rem,2vw,2rem)] leading-tight tabular-nums md:mt-4">
                {price(product)}
                <span className="ml-2 text-charcoal/50">/ {product.priceNote ?? c.perDay}</span>
              </p>
              <p className="mt-4 max-w-[32rem] font-text md:mt-5 text-[clamp(1rem,1.15vw,1.15rem)] leading-relaxed text-charcoal/75">
                {product.description}
              </p>

              {/* Cart: the button with a handwritten nudge pointing at it */}
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 md:mt-8">
                <AddToCart product={product} />
                <span className="q-hand flex items-center gap-1 text-[1.6rem] leading-none">
                  <HandArrowSmall className="h-9 w-8 -scale-x-100 rotate-[200deg]" />
                  <span className="-rotate-3">{t.note}</span>
                </span>
              </div>

              <ul className="mt-8 flex flex-col border-t md:mt-10 border-charcoal/15">
                {t.perks.map((perk) => (
                  <li
                    key={perk}
                    className="flex items-start gap-3 border-b border-charcoal/15 py-3.5 font-text text-[0.95rem] leading-snug text-charcoal/80"
                  >
                    <Check aria-hidden className="mt-[0.1em] size-4 shrink-0" strokeWidth={2.5} />
                    {perk}
                  </li>
                ))}
              </ul>

              {product.videos && product.videos.length > 0 && (
                <section className="mt-10 md:mt-12">
                  <h2 className="font-display text-xl font-medium leading-tight">{c.videos}</h2>
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

        {/* The whole catalog with its filters and search, as on the home page */}
        <ProductCatalog products={others} />

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
