import { Preloader } from "@/components/Preloader";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroSection } from "@/components/HeroSection";
// import { HeroVideoSection } from "@/components/HeroVideoSection";
// import { Chapter } from "@/components/Chapter";
import { ProductCatalog } from "@/components/ProductCatalog";
import { BrandMarquee } from "@/components/BrandMarquee";
import { StepsSection } from "@/components/StepsSection";
import { PricingSection } from "@/components/PricingSection";
import { CtaSection } from "@/components/CtaSection";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
// import { BrandStory } from "@/components/BrandStory";
import { SiteFooter } from "@/components/SiteFooter";
import { notFound } from "next/navigation";
import { getCatalog } from "@/data/products";
import { hasLocale } from "@/i18n/config";
import { businessJsonLd } from "@/lib/structuredData";
// import { CHAPTERS } from "@/data/chapters";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const products = getCatalog(lang);
  return (
    <>
      <JsonLd data={businessJsonLd(lang)} />
      <Preloader />
      <SiteHeader />
      <main>
        {/* Hidden: previous full-screen video hero, kept for reuse */}
        {/* <HeroVideoSection /> */}
        <HeroSection products={products} />
        <StepsSection locale={lang} />
        <PricingSection locale={lang} />
        {/* Hidden: legacy template chapters (jackets/shoes demo content), kept for reuse */}
        {/* {CHAPTERS.map((chapter) => (
          <Chapter key={chapter.index} data={chapter} />
        ))} */}
        <BrandMarquee />
        <ProductCatalog products={products} />
        <FaqSection locale={lang} />
        <CtaSection locale={lang} />
        {/* Hidden: brand-story narrative copy, kept for reuse */}
        {/* <BrandStory /> */}
      </main>
      <SiteFooter locale={lang} />
    </>
  );
}
