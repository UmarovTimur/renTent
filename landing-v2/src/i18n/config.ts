export const LOCALES = ["ru", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Russian lives at the site root, other languages under their own prefix. */
export const DEFAULT_LOCALE: Locale = "ru";

export const hasLocale = (value: string): value is Locale => (LOCALES as readonly string[]).includes(value);

/** Home page URL of a locale: "/" for Russian, "/en" for English. */
export const localeHome = (locale: Locale) => (locale === DEFAULT_LOCALE ? "/" : `/${locale}`);
