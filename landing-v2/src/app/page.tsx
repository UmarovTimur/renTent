import { Preloader } from "@/components/Preloader";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroSection } from "@/components/HeroSection";
import { IntroSection } from "@/components/IntroSection";
import { Chapter } from "@/components/Chapter";
import { CtaSection } from "@/components/CtaSection";
import { BrandStory } from "@/components/BrandStory";
import { SiteFooter } from "@/components/SiteFooter";
import { CHAPTERS } from "@/data/chapters";

export default function Home() {
  return (
    <>
      <Preloader />
      <SiteHeader />
      <main>
        <HeroSection />
        <IntroSection />
        {CHAPTERS.map((chapter) => (
          <Chapter key={chapter.index} data={chapter} />
        ))} 
        <CtaSection />
        <BrandStory />
      </main>
      <SiteFooter />
    </>
  );
}
