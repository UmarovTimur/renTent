"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LogoIcon } from "@/components/icons";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { skipPreloader } from "@/components/Preloader";
import { useI18n } from "@/i18n/I18nProvider";
import { localeHome, productHref } from "@/i18n/config";
import type { CatalogProduct } from "@/data/products";

// Same glass pill as the header menus (MorphMenu's closed trigger, light variant)
const PILL =
  "flex items-center gap-2 rounded-full bg-charcoal/40 px-3.5 py-2.5 font-display text-base leading-none text-white backdrop-blur-md transition-colors duration-300 hover:bg-charcoal/60 md:backdrop-blur-xl";

/**
 * Product page bar: back to the catalog, the logo home, and the same product
 * in the other language. Going back home from here skips the intro loader.
 */
export function ProductTopBar({ product }: { product: CatalogProduct }) {
  const { locale, t } = useI18n();

  useEffect(() => skipPreloader(), []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 mx-auto flex w-full max-w-[80rem] items-center justify-between gap-3 px-4 py-4 md:px-8">
      <Link href={`${localeHome(locale)}#catalog`} className={PILL}>
        <ArrowLeft aria-hidden strokeWidth={2.5} className="size-4 opacity-70" />
        {t.product.back}
      </Link>

      <Link href={localeHome(locale)} aria-label="rentTent" className="absolute left-1/2 -translate-x-1/2">
        <LogoIcon className="h-[1.125rem] w-auto" />
      </Link>

      <LanguageSwitcher dark={false} hrefFor={(l) => productHref(l, product.slug)} />
    </header>
  );
}
