"use client";

import { useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { ArrowButton } from "@/components/ArrowButton";
import { cn } from "@/lib/utils";
import type { Chapter as ChapterData, Outfit } from "@/data/chapters";

export function Chapter({ data }: { data: ChapterData }) {
  return (
    <div data-chapter={data.index}>
      <ChapterCover data={data} />
      {/* <CategoryDivider title={data.divider.title} cards={data.divider.cards} index={data.index} />
      <ProductFeature data={data} />
      {data.outfits.map((outfit) => (
        <OutfitShowcase key={outfit.audience} outfit={outfit} /> 
      ))} */}
    </div>
  );
}

/* ---------- Cover ---------- */
function ChapterCover({ data }: { data: ChapterData }) {
  return (
    <section
      id={`chapter-${data.index}`}
      data-chapter={data.index}
      data-header-theme="dark"
      className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-charcoal text-cream"
    >
      <Image
        src={data.cover.image}
        alt={data.cover.headline}
        fill
        sizes="100vw"
        className="object-cover"
        priority={false}
      />
      <div className="absolute inset-0 bg-charcoal/20" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-charcoal/45 to-transparent" />
      <div className="q-grain absolute inset-0" />
      <Reveal
        as="h2"
        className="relative z-10 px-6 text-center font-brand text-[clamp(2.75rem,9vw,9rem)] leading-[1.02]"
      >
        {data.cover.headline}
      </Reveal>
      <div className="absolute bottom-6 left-4 z-10 md:left-6">
        <span className="q-hand block text-base text-cream/90">{data.cover.category}</span>
      </div>
      <div className="absolute bottom-6 right-4 z-10 font-text text-sm tracking-wide text-cream/85 md:right-6">
        {data.cover.location}
      </div>
    </section>
  );
}

/* ---------- Category divider with photo cluster ---------- */
function CategoryDivider({
  title,
  cards,
  index,
}: {
  title: string;
  cards: string[];
  index: number;
}) {
  // scattered positions (desktop)
  const spots = [
    "left-[8%] top-[6%] w-[14rem] rotate-[-4deg]",
    "left-[26%] top-[46%] w-[11rem] rotate-[3deg]",
    "right-[24%] top-[40%] w-[12rem] rotate-[-2deg]",
    "right-[7%] top-[10%] w-[15rem] rotate-[5deg]",
  ];
  return (
    <section
      data-chapter={index}
      data-header-theme="light"
      className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-cream py-[14vh] text-charcoal"
    >
      {/* Photo cluster (desktop) */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        {cards.map((src, i) => (
          <Reveal
            key={src + i}
            delay={((i % 3) + 1) as 1 | 2 | 3}
            className={cn("absolute overflow-hidden rounded-2xl shadow-sm", spots[i % spots.length])}
          >
            <div className="relative aspect-[4/5] w-full">
              <Image src={src} alt="" fill sizes="16rem" className="object-cover" />
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal
        as="h3"
        className="relative z-10 text-center font-display text-[clamp(3rem,11vw,8.5rem)] font-medium leading-none"
      >
        {title}
      </Reveal>
    </section>
  );
}

/* ---------- Product feature (greige panels + toggle) ---------- */
function ProductFeature({ data }: { data: ChapterData }) {
  const [active, setActive] = useState(0);
  const product = data.products[active];
  return (
    <section
      data-chapter={data.index}
      data-header-theme="light"
      className="w-full bg-cream px-[1.6rem] py-[10vh] text-charcoal xl:px-[2rem]"
    >
      {/* toggle */}
      <div className="mb-[clamp(2rem,3vw,3.5rem)] flex items-center justify-center gap-[clamp(1.5rem,2.5vw,3rem)] font-display text-[clamp(1.75rem,3.4vw,3.4rem)] font-medium">
        {data.products.map((p, i) => (
          <button
            key={p.code}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "transition-colors duration-300",
              i === active ? "text-charcoal" : "text-charcoal/30 hover:text-charcoal/60",
            )}
          >
            {p.code}
          </button>
        ))}
      </div>

      {/* greige showcase panel — full width, 12-col grid, side padding only */}
      <Reveal className="relative w-full overflow-hidden rounded-[2rem] bg-[#dcd7ce] px-[clamp(1.5rem,4vw,6rem)] py-[clamp(3rem,6vw,8rem)]">
        <div className="grid grid-cols-1 items-center gap-[clamp(2rem,4vw,6rem)] lg:grid-cols-12">
          <div className="relative aspect-square w-full lg:col-span-5">
            <Image
              src={product.packshot}
              alt={product.code}
              fill
              sizes="(max-width: 1024px) 90vw, 42vw"
              className="object-contain"
            />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="font-display text-[clamp(1.75rem,2.6vw,2.7rem)] font-medium leading-[1.15]">
              {product.tagline}
            </p>
            <p className="mt-[clamp(1.25rem,1.5vw,2rem)] font-text text-[clamp(1.05rem,1.25vw,1.35rem)] leading-[1.4] text-charcoal/80">
              {product.detail}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------- Outfit showcase (Men / Women colorways) ---------- */
function OutfitShowcase({ outfit }: { outfit: Outfit }) {
  const [variantIdx, setVariantIdx] = useState(0);
  const [colorIdx, setColorIdx] = useState(0);
  const variant = outfit.variants[variantIdx];
  const color = variant.colorways[Math.min(colorIdx, variant.colorways.length - 1)];

  return (
    <section
      data-header-theme="dark"
      className="relative min-h-[90vh] overflow-hidden bg-charcoal py-[10vh] text-cream"
    >
      <Image src={outfit.background} alt="" fill sizes="100vw" className="object-cover opacity-70" />
      <div className="absolute inset-0 bg-charcoal/40" />
      <div className="q-container relative z-10">
        <div className="flex flex-col items-start gap-2">
          <span className="q-hand text-lg text-cream/80">Hiking outfit</span>
          <h4 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-medium leading-none">
            {outfit.audience}
          </h4>
        </div>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* product image */}
          <Reveal className="relative mx-auto aspect-[4/5] w-full max-w-[30rem]">
            <Image
              src={color.image}
              alt={`${variant.code} — ${color.name}`}
              fill
              sizes="(max-width: 1024px) 90vw, 30rem"
              className="object-contain"
            />
          </Reveal>

          {/* controls */}
          <div className="max-w-[26rem]">
            {/* variant toggle */}
            <div className="flex flex-wrap items-baseline gap-5 font-display text-[clamp(1.5rem,2.6vw,2.25rem)] font-medium">
              {outfit.variants.map((v, i) => (
                <button
                  key={v.code}
                  type="button"
                  onClick={() => {
                    setVariantIdx(i);
                    setColorIdx(0);
                  }}
                  className={cn(
                    "transition-colors duration-300",
                    i === variantIdx ? "text-cream" : "text-cream/40 hover:text-cream/70",
                  )}
                >
                  {v.code}
                </button>
              ))}
            </div>

            {/* colorways */}
            <p className="mt-6 font-text text-sm text-cream/70">{variant.colorwayCount}</p>
            <div className="mt-3 flex items-center gap-4">
              {variant.colorways.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  title={c.name}
                  onClick={() => setColorIdx(i)}
                  className={cn(
                    "h-8 w-8 rounded-full border transition-transform duration-300 hover:scale-110",
                    i === colorIdx ? "border-cream ring-2 ring-cream/40" : "border-cream/40",
                  )}
                  style={{ backgroundColor: c.swatch }}
                />
              ))}
            </div>
            <p className="mt-4 font-text text-base text-cream/90">{color.name}</p>

            {/* buy now */}
            <ArrowButton variant="light" className="mt-8">
              Buy now
            </ArrowButton>
          </div>
        </div>
      </div>
    </section>
  );
}
