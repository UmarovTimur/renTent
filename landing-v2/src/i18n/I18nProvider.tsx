"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

/**
 * Makes the page's language available to client components. Only the locale
 * crosses the server/client boundary; the dictionary (which holds functions
 * for plurals and phrasing) is looked up on each side.
 */
export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

/** Current locale and its dictionary, in client components. */
export function useI18n() {
  const locale = useContext(LocaleContext);
  return { locale, t: getDictionary(locale) };
}
