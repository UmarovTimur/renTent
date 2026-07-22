import { Reveal } from "@/components/Reveal";
import { ArrowButton } from "@/components/ArrowButton";
import {
  InstagramIcon,
  FacebookIcon,
  TiktokIcon,
  YoutubeIcon,
} from "@/components/icons";

const SOCIALS = [
  { label: "Instagram", Icon: InstagramIcon },
  { label: "Facebook", Icon: FacebookIcon },
  { label: "TikTok", Icon: TiktokIcon },
  { label: "YouTube", Icon: YoutubeIcon },
];

const LEGAL = [
  "Управление cookie",
  "Политика cookie",
  "Политика конфиденциальности",
  "Условия использования",
];

export function SiteFooter() {
  return (
    <footer
      data-header-theme="dark"
      className="relative overflow-hidden bg-charcoal pt-[14vh] text-cream"
    >
      <div className="q-grain absolute inset-0" />
      <div className="q-container relative z-10">
        <Reveal
          as="h2"
          className="font-brand text-[clamp(2.5rem,8vw,7rem)] leading-[1.02]"
        >
          Аренда туристического <span className="italic pr-[0.12em]">снаряжения</span> для гор
        </Reveal>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-[34rem] font-text text-[clamp(1.05rem,1.4vw,1.35rem)] leading-[1.4] text-cream/80">
            Едете в горы под Ташкентом на выходные — снаряжение можно забрать в
            день выезда и вернуть сразу после похода.
          </p>
          <ArrowButton
            href="https://t.me/REPLACE_USERNAME"
            target="_blank"
            rel="noopener noreferrer"
            variant="light"
          >
            Написать в Telegram
          </ArrowButton>
        </div>

        {/* Socials */}
        <div className="mt-16 flex flex-col gap-4">
          <span className="q-hand text-lg text-cream/80">Мы в соцсетях</span>
          <div className="flex items-center gap-5">
            {SOCIALS.map(({ label, Icon }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors duration-300 hover:border-cream hover:bg-cream hover:text-charcoal"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-4 border-t border-cream/15 py-8 text-sm text-cream/60 md:flex-row md:items-center md:justify-between">
          <span>© 2025 Аренда туристического инвентаря. Ташкент.</span>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL.map((item) => (
              <li key={item}>
                <a href="#" className="transition-colors hover:text-cream">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
