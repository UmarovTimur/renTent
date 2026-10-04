import type { MetadataRoute } from "next";
import { CATALOG } from "@/data/products";
import { LOCALES, localeHome, productHref, type Locale } from "@/i18n/config";
import { absoluteUrl } from "@/lib/site";

/** One entry per page and language, each listing all its language versions. */
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (href: (l: Locale) => string, priority: number, images?: string[]) =>
    LOCALES.map((locale) => ({
      url: absoluteUrl(href(locale)),
      changeFrequency: "weekly" as const,
      priority,
      alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, absoluteUrl(href(l))])) },
      ...(images && { images: images.map(absoluteUrl) }),
    }));

  return [
    ...page(localeHome, 1),
    ...CATALOG.flatMap((p) => page((l) => productHref(l, p.slug), 0.8, p.images)),
  ];
}
