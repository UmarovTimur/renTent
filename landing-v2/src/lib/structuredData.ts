import { CATALOG, type CatalogProduct } from "@/data/products";
import { localeHome, productHref, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { INSTAGRAM_URL, MANAGER_PHONE, PICKUP_GEO, TELEGRAM_CHANNEL_URL } from "@/lib/contacts";
import type { FaqItem } from "@/lib/faq";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

// schema.org JSON-LD for the pages. The business has one stable @id so the
// product offers can point at it as their seller.
const BUSINESS_ID = `${SITE_URL}/#business`;

const prices = CATALOG.map((p) => p.price);

/** The rental business itself: who, where, how to reach, price range. */
export function businessJsonLd(locale: Locale) {
  const { meta } = getDictionary(locale);
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": BUSINESS_ID,
    name: SITE_NAME,
    description: meta.description,
    url: absoluteUrl(localeHome(locale)),
    logo: absoluteUrl("/seo/android-chrome-512x512.png"),
    image: absoluteUrl("/seo/og.jpg"),
    telephone: MANAGER_PHONE.replace(/\s/g, ""),
    priceRange: `${Math.min(...prices)}–${Math.max(...prices)} UZS`,
    currenciesAccepted: "UZS",
    address: { "@type": "PostalAddress", addressLocality: "Tashkent", addressCountry: "UZ" },
    geo: { "@type": "GeoCoordinates", ...PICKUP_GEO },
    areaServed: { "@type": "City", name: "Tashkent" },
    // The site advertises 24/7 service
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    sameAs: [INSTAGRAM_URL, TELEGRAM_CHANNEL_URL],
  };
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/** A product page: the item, its per-day rental offer and the breadcrumb. */
export function productJsonLd(locale: Locale, product: CatalogProduct) {
  const dict = getDictionary(locale);
  const url = absoluteUrl(productHref(locale, product.slug));
  return [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: product.images.map(absoluteUrl),
      category: dict.catalog.categories[product.category],
      url,
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: "UZS",
        price: product.price,
        // A rental, priced per day unless the product says otherwise
        businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
        ...(!product.priceNote && {
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: product.price,
            priceCurrency: "UZS",
            unitCode: "DAY",
          },
        }),
        areaServed: { "@type": "City", name: "Tashkent" },
        seller: { "@id": BUSINESS_ID },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE_NAME, item: absoluteUrl(localeHome(locale)) },
        { "@type": "ListItem", position: 2, name: dict.product.back, item: `${SITE_URL}${localeHome(locale)}#catalog` },
        { "@type": "ListItem", position: 3, name: product.name, item: url },
      ],
    },
  ];
}
