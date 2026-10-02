import { LoadingImage } from "@/components/LoadingImage";
import { Reveal } from "@/components/Reveal";
import { ArrowButton } from "@/components/ArrowButton";
import { TermsDialog } from "@/components/TermsDialog";
import { cn } from "@/lib/utils";
import { HandArrowSmall, InstagramIcon, TelegramIcon } from "@/components/icons";
import { Phone } from "lucide-react";
import { MANAGER_PHONE, MANAGER_PHONE_HREF, MANAGER_TELEGRAM, PICKUP_COORDS } from "@/lib/contacts";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";

// `brand` is the logo's official fill, faded in on hover (gradients can't be
// color-transitioned, so it lives on an overlay layer).
const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/rentent.uz",
    Icon: InstagramIcon,
    brand:
      "bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285aeb_90%)]",
  },
  {
    label: "Telegram",
    href: "https://t.me/renTent_uz",
    Icon: TelegramIcon,
    brand: "bg-[#26a5e4]",
  },
];

/**
 * Footer on cream: a landscape photo beside a stone-grey card (headline, copy,
 * Telegram CTA, socials with a handwritten cue), then a thin bar with the copyright, the terms-of-use dialog and the developer credit.
 */
export function SiteFooter({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).footer;
  return (
    // Mobile bottom padding clears the fixed menu pill (its bottom offset +
    // ~3rem pill + a gap) so the legal bar isn't hidden under it.
    <footer
      data-header-theme="light"
      className="relative bg-cream px-4 pb-[calc(max(1rem,env(safe-area-inset-bottom))+4.5rem)] pt-12 text-charcoal md:px-[1.6rem] md:pb-6 md:pt-[10vh]"
    >
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[27rem_minmax(0,1fr)]">
        {/* Photo */}
        {/* Portrait shot with a caption baked into its middle: taller crop on
            phones, a 27rem square on desktop (the card beside it stretches to
            that height), focus nudged down so the caption and the tent stay in
            frame. */}
        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[16/10] lg:aspect-auto lg:h-[27rem]">
          <LoadingImage
            src="/images/footer.jpg"
            alt={t.photoAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 432px"
            className="object-cover object-[center_55%]"
          />
        </Reveal>

        {/* Card */}
        <Reveal
          delay={1}
          className="relative flex flex-col justify-between gap-8 rounded-2xl bg-[#dcd7ce] p-6 pt-16 text-center sm:text-left md:gap-12 md:p-[clamp(2rem,3.4vw,3.5rem)]"
        >
          {/* Handwritten, blinking coordinates in the card's top-right corner,
              inset like the content (Caveat: Casey has no degree sign) */}
          <p className="q-hand q-blink absolute right-6 top-6 rotate-2 font-[family-name:var(--font-caveat)] text-[clamp(1.3rem,1.8vw,1.75rem)] leading-none md:right-[clamp(2rem,3.4vw,3.5rem)] md:top-[clamp(2rem,3.4vw,3.5rem)]">
            {PICKUP_COORDS}
          </p>
          <div>
            <h2 className="font-display text-[clamp(2.5rem,3.8vw,3.75rem)] font-medium leading-[1.05] tracking-[-0.02em]">
              {t.title}
            </h2>
            <p className="mx-auto mt-4 max-w-[46rem] font-display sm:mx-0 text-[clamp(1.05rem,1.6vw,1.6rem)] leading-[1.3] text-charcoal/85">
              {t.lead}
            </p>
          </div>

          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-end sm:justify-between">
            {/* Telegram CTA with the phone number under it */}
            <div className="flex flex-col items-center gap-4 sm:items-start">
              <ArrowButton href={MANAGER_TELEGRAM} target="_blank" rel="noopener noreferrer" variant="dark">
                {t.telegram}
              </ArrowButton>
              <a
                href={MANAGER_PHONE_HREF}
                className="flex items-center gap-2 font-display text-lg font-medium tabular-nums transition-opacity hover:opacity-60 sm:pl-1"
              >
                <Phone aria-hidden strokeWidth={2.5} className="size-4" />
                {MANAGER_PHONE}
              </a>
            </div>

            <div className="flex items-end gap-2">
              {/* Handwritten cue: label, then an arrow curling down-right into the
                  icons. One shared blinking shadow on the wrapper keeps both in sync. */}
              <span className="q-blink-shape flex flex-col items-end pb-5">
                <span className="q-hand -rotate-6 text-3xl font-bold leading-none">{t.socials}</span>
                <HandArrowSmall className="mr-1 mt-1 h-10 w-9 -scale-x-100 -rotate-12" />
              </span>
              <div className="flex items-center gap-4">
                {SOCIALS.map(({ label, href, Icon, brand }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-cream text-charcoal transition-colors duration-300 hover:text-white"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                        brand,
                      )}
                    />
                    <Icon className="relative h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Legal bar */}
      <div className="mt-6 flex flex-col items-center gap-3 text-center font-display text-[0.95rem] md:flex-row md:justify-between md:text-left">
        <span>© {new Date().getFullYear()} {t.copyright}</span>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-2">
          <TermsDialog />
          <span>
            {t.developedBy}{" "}
            <a
              href="https://github.com/UmarovTimur"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              Timur Umarov
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
