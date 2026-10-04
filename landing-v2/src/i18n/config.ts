export const LOCALES = ["ru", "uz", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Russian lives at the site root, other languages under their own prefix. */
export const DEFAULT_LOCALE: Locale = "ru";

/** Open Graph `og:locale` of each language. */
export const OG_LOCALES: Record<Locale, string> = { ru: "ru_RU", uz: "uz_UZ", en: "en_US" };

export const hasLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value);

/** Home page URL of a locale: "/" for Russian, "/en" for English. */
export const localeHome = (locale: Locale) => (locale === DEFAULT_LOCALE ? "/" : `/${locale}`);

/** Product page URL: "/catalog/<slug>" for Russian, "/en/catalog/<slug>" otherwise. */
export const productHref = (locale: Locale, slug: string) =>
  `${locale === DEFAULT_LOCALE ? "" : `/${locale}`}/catalog/${slug}`;
