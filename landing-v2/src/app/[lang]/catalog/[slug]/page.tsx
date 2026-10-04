import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ProductPage } from "@/components/product/ProductPage";
import { CATALOG, getCatalog } from "@/data/products";
import { DEFAULT_LOCALE, LOCALES, OG_LOCALES, hasLocale, productHref } from "@/i18n/config";
import { SITE_NAME } from "@/lib/site";
import { productJsonLd } from "@/lib/structuredData";
import { getDictionary } from "@/i18n";

// One static page per product and language; unknown slugs are a 404.
export const dynamicParams = false;
export function generateStaticParams() {
  return CATALOG.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/catalog/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const product = getCatalog(lang).find((p) => p.slug === slug);
  if (!product) return {};
  const t = getDictionary(lang).product;
  return {
    title: t.metaTitle(product.name),
    description: product.description,
    alternates: {
      canonical: productHref(lang, slug),
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, productHref(l, slug)])),
        "x-default": productHref(DEFAULT_LOCALE, slug),
      },
    },
    openGraph: {
      title: t.metaTitle(product.name),
      description: product.description,
      url: productHref(lang, slug),
      siteName: SITE_NAME,
      locale: OG_LOCALES[lang],
      images: product.images.slice(0, 1),
      type: "website",
    },
  };
}

export default async function Page({ params }: PageProps<"/[lang]/catalog/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const catalog = getCatalog(lang);
  const product = catalog.find((p) => p.slug === slug);
  if (!product) notFound();
  return (
    <>
      <JsonLd data={productJsonLd(lang, product)} />
      <ProductPage locale={lang} product={product} others={catalog.filter((p) => p.id !== product.id)} />
    </>
  );
}
