import { Plus } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/Reveal";
import { typograph } from "@/lib/typograph";
import { getFaq } from "@/lib/faq";
import { faqJsonLd } from "@/lib/structuredData";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";

/**
 * Frequently asked questions as native disclosures (the answers stay in the
 * HTML, readable by crawlers and AI), with the same items as FAQPage JSON-LD.
 */
export function FaqSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).faq;
  const items = getFaq(locale);
  return (
    <section id="faq" data-header-theme="light" className="bg-cream py-12 text-charcoal md:py-[10vh]">
      <JsonLd data={faqJsonLd(items)} />
      <div className="q-container grid gap-8 lg:grid-cols-12 lg:gap-x-[clamp(2rem,4vw,5rem)]">
        <Reveal
          as="h2"
          className="font-display text-[clamp(2.5rem,5.5vw,5rem)] font-semibold leading-none tracking-[-0.02em] lg:col-span-4"
        >
          {t.title}
        </Reveal>
        <div className="border-b border-charcoal/15 lg:col-span-8">
          {items.map(({ q, a }) => (
            <details key={q} className="group border-t border-charcoal/15">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-[clamp(1.1rem,1.8vw,1.6rem)] font-display text-[clamp(1.1rem,1.5vw,1.5rem)] font-medium leading-snug [&::-webkit-details-marker]:hidden">
                {typograph(q)}
                <Plus
                  aria-hidden
                  className="size-5 shrink-0 transition-transform duration-300 group-open:rotate-45"
                  strokeWidth={2}
                />
              </summary>
              <p className="max-w-[42rem] pb-[clamp(1.1rem,1.8vw,1.6rem)] font-text text-[clamp(0.95rem,1.1vw,1.1rem)] leading-relaxed text-charcoal/75">
                {typograph(a)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
