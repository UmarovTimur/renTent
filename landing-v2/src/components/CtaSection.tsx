import { Reveal } from "@/components/Reveal";
import { ArrowButton } from "@/components/ArrowButton";
import { typograph } from "@/lib/typograph";
import { MANAGER_TELEGRAM } from "@/lib/contacts";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";

/**
 * "Пишите нам" — call to action on cream that links to the manager in Telegram.
 */
export function CtaSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).cta;
  return (
    <section
      id="contacts"
      data-header-theme="light"
      className="relative flex items-center justify-center overflow-hidden bg-cream py-12 text-charcoal md:min-h-[70vh] md:py-[14vh]"
    >
      <div className="q-container flex flex-col items-center text-balance text-center">
        <Reveal
          as="h2"
          className="max-w-[14em] font-display text-[clamp(1.75rem,6vw,5.5rem)] font-medium leading-[1.05]"
        >
          {typograph(t.title)}
        </Reveal>
        <Reveal
          as="p"
          delay={1}
          className="mt-4 max-w-[38rem] font-text md:mt-8 text-[clamp(1.05rem,1.4vw,1.35rem)] leading-[1.4] text-charcoal/80"
        >
          {typograph(t.lead)}
        </Reveal>
        <Reveal delay={2} className="mt-6 md:mt-10">
          <ArrowButton
            href={MANAGER_TELEGRAM}
            target="_blank"
            rel="noopener noreferrer"
            variant="dark"
          >
            {t.button}
          </ArrowButton>
        </Reveal>
      </div>
    </section>
  );
}
