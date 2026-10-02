import { LazyVideo } from "@/components/LazyVideo";
import { LineReveal } from "@/components/LineReveal";
import { Reveal } from "@/components/Reveal";
import { typograph } from "@/lib/typograph";
import { MANAGER_TELEGRAM } from "@/lib/contacts";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";

// "Telegram" in the copy links to the manager's chat
const LINKS = { Telegram: MANAGER_TELEGRAM };


/**
 * "Как это работает" — a looping video on the left, and on the right the heading
 * over a plain numbered list: each step is a ruled row with its number and
 * one sentence.
 */
export function StepsSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).steps;
  return (
    <section id="how" data-header-theme="light" className="bg-cream py-12 text-charcoal md:py-[12vh]">
      {/* Mobile order is the DOM order: heading, video, subtitle, steps. On
          desktop the video sits in the left column at a near-native 4:3 and
          stays pinned in the middle of the viewport while the steps scroll
          past, instead of stretching to the full height of the list. */}
      <div className="q-container grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-[auto_auto_1fr] lg:gap-x-[clamp(2rem,4vw,5rem)]">
        {/* All text rises line by line out of a mask, like the hero h1 */}
        <LineReveal
          as="h2"
          text={typograph(t.title)}
          className="font-display text-[clamp(2.5rem,5.5vw,5rem)] font-semibold leading-none tracking-[-0.02em] lg:col-span-7 lg:col-start-6 lg:row-start-1"
        />

        {/* The column is a size container so the pinned offset can use its
            width: a 4:3 video is 75cqw tall, so top = 50svh − 37.5cqw puts
            it in the middle of the viewport. */}
        <div className="mt-8 lg:@container lg:col-span-5 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
          <Reveal theme="dark" className="relative aspect-video overflow-hidden rounded-2xl lg:sticky lg:top-[max(6rem,calc(50svh-37.5cqw))] lg:aspect-[4/3]">
            <LazyVideo
              className="absolute inset-0 h-full w-full object-cover"
              poster="/images/steps-poster.jpg"
              src="/videos/steps-loop.mp4"
            />
          </Reveal>
        </div>

        <LineReveal
          text={typograph(t.lead)}
          start={1}
          links={LINKS}
          className="mt-8 max-w-[36rem] text-pretty font-text text-[clamp(1.1rem,1.4vw,1.5rem)] font-medium text-charcoal/70 lg:col-span-7 lg:col-start-6 lg:row-start-2 lg:mt-4"
        />

        <div className="lg:col-span-7 lg:col-start-6 lg:row-start-3">
          <ol className="mt-[clamp(2.5rem,5vw,4.5rem)] border-b border-charcoal/15">
            {t.items.map((text, i) => (
              <li
                key={text}
                className="grid grid-cols-[3.5rem_1fr] items-baseline gap-4 border-t border-charcoal/15 py-[clamp(1.25rem,2.2vw,2rem)] md:grid-cols-[6rem_1fr]"
              >
                <LineReveal
                  as="span"
                  text={String(i + 1).padStart(2, "0")}
                  className="block font-display text-[clamp(1.75rem,2.6vw,2.75rem)] font-semibold leading-none tabular-nums text-charcoal/35"
                />
                <LineReveal
                  text={typograph(text)}
                  start={1}
                  links={LINKS}
                  className="max-w-[42rem] text-pretty font-display text-[clamp(1.3rem,2.1vw,2.25rem)] font-semibold leading-[1.25] tracking-[-0.01em]"
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
