import Image from "next/image";
import { Reveal } from "@/components/Reveal";

/**
 * Manifesto + "trail" of scattered photo cards linked by a decorative
 * hand-drawn path, closing with the French-Alps body paragraph.
 */
export function IntroSection() {
  return (
    <section
      data-chapter="0"
      data-header-theme="light"
      className="relative overflow-hidden bg-cream py-[12vh] text-charcoal"
    >
      <div className="q-container">
        {/* Manifesto */}
        <Reveal
          as="h2"
          className="max-w-[65rem] font-display text-[clamp(1.9rem,4vw,3.65rem)] font-medium leading-[1.15]"
        >
          Our new hiking collection is the ultimate invitation to explore the great
          outdoors, where cutting-edge technology meets contemporary style.
        </Reveal>

        {/* Trail region */}
        <div className="relative mt-[8vh] min-h-[80px]">
          {/* Decorative winding trail (desktop only) */}
          <svg
            className="pointer-events-none absolute inset-0 hidden h-full w-full text-charcoal/35 lg:block"
            viewBox="0 0 1200 1500"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M120 40 C 400 120, 700 60, 900 220 S 1160 360, 1000 460 C 820 560, 300 470, 220 640 S 360 900, 620 1000 C 820 1080, 760 1300, 640 1460"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="1 7"
            />
          </svg>

          <div className="grid grid-cols-1 gap-y-16 lg:min-h-[1400px] lg:grid-cols-12 lg:gap-0">
            {/* Body paragraph — upper left */}
            <Reveal className="lg:col-span-5 lg:col-start-3 lg:pt-24">
              <p className="max-w-[34rem] font-text text-[clamp(1.05rem,1.35vw,1.35rem)] leading-[1.32]">
                Designed in the heart of the French Alps and crafted with hikers in
                mind, our latest collection combines technical performance with modern
                aesthetics, ensuring you look and feel your best on every trail. Embrace
                the wonders of hiking and elevate your outdoor experience, where every
                step inspires a deeper connection to the mountains.
              </p>
            </Reveal>

            {/* Card A — portrait, top right */}
            <Reveal className="lg:col-span-4 lg:col-start-9 lg:pt-4" delay={1}>
              <div className="relative aspect-[573/716] w-full overflow-hidden rounded-2xl lg:mx-auto lg:max-w-[26rem]">
                <Image
                  src="/images/intro/tracking.jpg"
                  alt="Hiker resting on a rock in the mountains"
                  fill
                  sizes="(max-width: 1024px) 100vw, 26rem"
                  className="object-cover"
                />
              </div>
            </Reveal>

            {/* Card B — square, left */}
            <Reveal className="lg:col-span-3 lg:col-start-2 lg:row-start-2 lg:-mt-24" delay={2}>
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl lg:max-w-[21rem]">
                <Image
                  src="/images/intro/card-6.jpg"
                  alt="Detail of a Quechua hiking jacket"
                  fill
                  sizes="(max-width: 1024px) 100vw, 21rem"
                  className="object-cover"
                />
              </div>
            </Reveal>

            {/* Card C — landscape, center */}
            <Reveal
              className="lg:col-span-6 lg:col-start-6 lg:row-start-3 lg:mt-8"
              delay={1}
            >
              <div className="relative aspect-[573/378] w-full overflow-hidden rounded-2xl lg:mx-auto lg:max-w-[38rem]">
                <Image
                  src="/images/intro/wide.jpg"
                  alt="Hikers walking through an alpine valley"
                  fill
                  sizes="(max-width: 1024px) 100vw, 38rem"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
