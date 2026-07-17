import { Reveal } from "@/components/Reveal";
import { ArrowButton } from "@/components/ArrowButton";

/**
 * "Unleash your next adventure" — full-collection call to action on cream.
 */
export function CtaSection() {
  return (
    <section
      data-header-theme="light"
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-cream py-[14vh] text-charcoal"
    >
      <div className="q-container flex flex-col items-center text-center">
        <Reveal
          as="h2"
          className="max-w-[14em] font-display text-[clamp(2.25rem,6vw,5.5rem)] font-medium leading-[1.05]"
        >
          Unleash your next adventure
        </Reveal>
        <Reveal
          as="p"
          delay={1}
          className="mt-8 max-w-[38rem] font-text text-[clamp(1.05rem,1.4vw,1.35rem)] leading-[1.4] text-charcoal/80"
        >
          Explore our full collection of hiking gear and accessories—everything you need
          for your next journey is here.
        </Reveal>
        <Reveal delay={2} className="mt-10">
          <ArrowButton
            href="https://www.decathlon.com"
            target="_blank"
            rel="noopener noreferrer"
            variant="dark"
          >
            See full collection
          </ArrowButton>
        </Reveal>
      </div>
    </section>
  );
}
