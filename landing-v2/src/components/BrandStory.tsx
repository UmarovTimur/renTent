import Image from "next/image";
import { Reveal } from "@/components/Reveal";

/**
 * Brand heritage — "Crafted in the heart of the French Alps" over a scenic
 * full-bleed image, with the "Since 1997" heritage note and Mountain Lab
 * location caption.
 */
export function BrandStory() {
  return (
    <section
      data-header-theme="dark"
      className="relative overflow-hidden bg-charcoal py-[16vh] text-cream"
    >
      <Image
        src="/images/cover.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-charcoal/40" />
      <div className="q-grain absolute inset-0" />

      <div className="q-container relative z-10">
        <Reveal
          as="h2"
          className="max-w-[16em] font-display text-[clamp(2rem,5vw,4.6rem)] font-medium leading-[1.1]"
        >
          Crafted in the heart of the French Alps. Here at Quechua, Decathlon&apos;s
          mountain sports specialist, we&apos;ve been designing innovative performance
          gear for over 25 years.
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[auto_1fr] lg:gap-20">
          <Reveal className="q-hand text-2xl text-cream/90">Since 1997</Reveal>
          <Reveal
            as="p"
            delay={1}
            className="max-w-[46rem] font-text text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.5] text-cream/85"
          >
            Inspired by the rugged beauty of the French Alps, each piece in this collection
            is crafted with the spirit of adventure in mind. We combine our deep
            understanding of the mountains with cutting-edge technology to create gear that
            endures even the toughest terrains. Every product is designed for you to get
            the most out of your outdoor experiences, with every detail carefully
            engineered to support your hiking or outdoor escapades.
          </Reveal>
        </div>
      </div>

      <div className="absolute bottom-6 right-4 z-10 font-text text-sm tracking-wide text-cream/80 md:right-6">
        Decathlon Mountain Lab  45,91616° N, 6,69121° E
      </div>
    </section>
  );
}
