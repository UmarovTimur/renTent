import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage } from "@/components/product/ProductPage";
import { CATALOG, getCatalog } from "@/data/products";
import { LOCALES, hasLocale, productHref } from "@/i18n/config";
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
      languages: Object.fromEntries(LOCALES.map((l) => [l, productHref(l, slug)])),
    },
    openGraph: {
      title: t.metaTitle(product.name),
      description: product.description,
      images: product.images.slice(0, 1),
    },
  };
}

export default async function Page({ params }: PageProps<"/[lang]/catalog/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const catalog = getCatalog(lang);
  const product = catalog.find((p) => p.slug === slug);
  if (!product) notFound();
  // Same category first, then the rest of the catalog, so there are always four
  const others = catalog.filter((p) => p.id !== product.id && p.images.length > 0);
  const related = [
    ...others.filter((p) => p.category === product.category),
    ...others.filter((p) => p.category !== product.category),
  ].slice(0, 4);
  return <ProductPage locale={lang} product={product} related={related} />;
}
