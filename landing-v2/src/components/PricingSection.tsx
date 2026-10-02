import { LineReveal } from "@/components/LineReveal";
import { RentalDaysCalculator } from "@/components/RentalDaysCalculator";
import { Reveal } from "@/components/Reveal";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { typograph } from "@/lib/typograph";


// Same type for every figure so the three cards share one baseline; on
// phones as big as an h2 (and the calculator's total)
const FIGURE =
  "font-display text-[2.5rem] font-semibold leading-none tracking-[-0.02em] md:text-[clamp(1.6rem,3.2vw,3.25rem)]";
// The price formula is a line of words, not a figure: smaller on phones so
// all three terms stay on one row
const TERM = "font-display text-[clamp(1.6rem,3.2vw,3.25rem)] font-semibold leading-none tracking-[-0.02em]";
const EYEBROW = "font-text text-sm uppercase tracking-[0.14em] text-charcoal/50";
const NOTE = "mt-2 font-text text-sm text-charcoal/50";
const DESC =
  "mt-3 max-w-[24rem] text-pretty font-text text-[clamp(1rem,1.15vw,1.2rem)] leading-snug text-charcoal/70";


/**
 * "Платите за сутки, а не за даты" — how the rental price is counted. The
 * heading and lead sit on top; below, an interactive calculator (pick up and
 * return times over two mountain photos, timeline in between), then the two rules
 * and the price formula.
 */
export function PricingSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).pricing;
  const rules = [t.rounding, t.minimum];
  return (
    <section id="pricing" data-header-theme="light" className="bg-cream py-12 text-charcoal md:py-[12vh]">
      <div className="q-container">
        <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:items-end lg:gap-x-[clamp(2rem,4vw,5rem)]">
          <LineReveal
            as="h2"
            text={typograph(t.title)}
            className="font-display text-[clamp(2.5rem,5.5vw,5rem)] font-semibold leading-none tracking-[-0.02em] lg:col-span-7"
          />
          <LineReveal
            text={typograph(t.lead)}
            start={1}
            className="max-w-[38rem] text-pretty font-text text-[clamp(1.1rem,1.4vw,1.5rem)] font-medium text-charcoal/70 lg:col-span-5"
          />
        </div>

        <RentalDaysCalculator />

        {/* Rules and the formula */}
        <div className="mt-3 grid grid-cols-1 gap-3 md:mt-4 md:grid-cols-2 md:gap-4 lg:grid-cols-12">
          {rules.map((rule, i) => (
            <Reveal
              key={rule.value}
              delay={i === 0 ? 1 : 2}
              className="flex flex-col justify-between gap-5 rounded-2xl border md:gap-10 border-charcoal/15 p-[clamp(1.5rem,2.5vw,2.25rem)] lg:col-span-3"
            >
              {/* Label and description on top, the figure with its note pinned to the bottom */}
              <div>
                <p className={EYEBROW}>{rule.eyebrow}</p>
                <p className={DESC}>{typograph(rule.text)}</p>
              </div>
              <div>
                <p className={FIGURE}>{rule.value}</p>
                <p className={NOTE}>{rule.note}</p>
              </div>
            </Reveal>
          ))}

          <Reveal
            delay={3}
            className="flex flex-col justify-between gap-5 rounded-2xl bg-[#e9e7df] md:gap-10 p-[clamp(1.5rem,2.5vw,2.25rem)] md:col-span-2 lg:col-span-6"
          >
            <div>
              <p className={EYEBROW}>{t.total.eyebrow}</p>
              <p className={DESC}>{typograph(t.total.text)}</p>
            </div>
            <div className="flex items-start gap-x-[clamp(0.6rem,1.5vw,1.5rem)]">
              {t.total.formula.map((f, i) => (
                <div key={f.term} className="flex items-start gap-x-[clamp(0.6rem,1.5vw,1.5rem)]">
                  {i > 0 && (
                    <span aria-hidden className={`${TERM} font-medium text-charcoal/30`}>
                      ×
                    </span>
                  )}
                  <div>
                    <p className={TERM}>{f.term}</p>
                    <p className={NOTE}>{f.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
