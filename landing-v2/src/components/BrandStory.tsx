import Image from "next/image";
import { Reveal } from "@/components/Reveal";

/**
 * Brand heritage — "Оригинальные бренды и понятные условия" over a scenic
 * full-bleed image, with a heritage note and the Tashkent location caption.
 */
export function BrandStory() {
  return (
    <section
      data-header-theme="dark"
      className="relative overflow-hidden bg-charcoal py-[16vh] text-cream"
    >
      <Image
        src="/images/rent/lifestyle-tent-shade.jpg"
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
          Оригинальные бренды, проверенное снаряжение и понятные условия — мы
          готовим каждую вещь для гор так, будто идём в поход сами.
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-[auto_1fr] lg:gap-20">
          <Reveal className="q-hand text-2xl text-cream/90">Проверено в горах</Reveal>
          <Reveal
            as="p"
            delay={1}
            className="max-w-[46rem] font-text text-[clamp(1rem,1.3vw,1.2rem)] leading-[1.5] text-cream/85"
          >
            Мы сдаём в аренду туристическое снаряжение для походов в горы,
            кемпинга и пикников в Ташкенте и области — палатки на 4, 5 и 8
            человек, спальные мешки, карематы, рюкзаки, треккинговые палки,
            кухонное оборудование и кемпинговую мебель. Всё снаряжение — от
            Naturehike, Jeep, Camel и FireMaple, в рабочем состоянии и
            проверено перед каждой выдачей.
          </Reveal>
        </div>
      </div>

      <div className="absolute bottom-6 right-4 z-10 font-text text-sm tracking-wide text-cream/80 md:right-6">
        🇺🇿 Узбекистан, город Ташкент 📍
      </div>
    </section>
  );
}
