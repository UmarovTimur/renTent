import { getCatalog } from "@/data/products";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { formatNumber } from "@/lib/intl";

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * FAQ of a language: the tent prices come straight from the catalog so they
 * never drift from it. Shared by the visible section and its FAQPage JSON-LD.
 */
export function getFaq(locale: Locale): FaqItem[] {
  const dict = getDictionary(locale);
  const tents = getCatalog(locale)
    .filter((p) => p.category === "tents")
    .sort((a, b) => a.price - b.price)
    .map((p) => `${p.name} — ${formatNumber(dict.intl, p.price)} ${dict.catalog.currency}`)
    .join(", ");
  return [{ q: dict.faq.tentPrices.q, a: dict.faq.tentPrices.a(tents) }, ...dict.faq.items];
}
