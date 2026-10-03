"use client";

import { Globe } from "lucide-react";
import { MorphMenu, MorphMenuItem } from "@/components/MorphMenu";
import { useI18n } from "@/i18n/I18nProvider";
import { LOCALES, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";

/**
 * Header language switcher: a pill showing the current language that grows
 * into the list of languages, anchored right. `hrefFor` gives the same page
 * in another language.
 */
export function LanguageSwitcher({ dark, hrefFor }: { dark: boolean; hrefFor: (locale: Locale) => string }) {
  const { locale, t } = useI18n();
  return (
    <MorphMenu
      dark={dark}
      align="right"
      panelClassName="w-40"
      trigger={() => (
        <>
          <Globe className="h-4 w-4 opacity-70" aria-label={t.header.language} />
          <span className="font-display leading-none">{locale.toUpperCase()}</span>
        </>
      )}
    >
      {(close) =>
        LOCALES.map((l, i) => (
          <MorphMenuItem
            key={l}
            index={i}
            active={l === locale}
            label={getDictionary(l).languageName}
            onClick={() => {
              close();
              // Each language is its own page
              if (l !== locale) window.location.assign(hrefFor(l));
            }}
          />
        ))
      }
    </MorphMenu>
  );
}
