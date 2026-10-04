import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Caveat, Geologica } from "next/font/google";
import "../globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartButton } from "@/components/cart/CartButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { I18nProvider } from "@/i18n/I18nProvider";
import { DEFAULT_LOCALE, LOCALES, OG_LOCALES, hasLocale, localeHome } from "@/i18n/config";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { getDictionary } from "@/i18n";

// Primary typeface for all UI and copy (covers Cyrillic).
const geologica = Geologica({ subsets: ["latin", "cyrillic"], variable: "--font-geologica" });
// The self-hosted Decathlon/Casey faces are Latin-only, so Cyrillic copy needs
// a handwritten fallback that actually has the glyphs.
const caveat = Caveat({ subsets: ["latin", "cyrillic"], variable: "--font-caveat" });

// One static page per language; any other prefix is a 404.
export const dynamicParams = false;
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getDictionary(lang);
  return {
    title: meta.title,
    description: meta.description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: localeHome(lang),
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, localeHome(l)])),
        "x-default": localeHome(DEFAULT_LOCALE),
      },
    },
    icons: {
      icon: [
        { url: "/seo/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/seo/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: "/seo/apple-touch-icon.png",
    },
    openGraph: {
      title: meta.title,
      description: meta.ogDescription,
      url: localeHome(lang),
      siteName: SITE_NAME,
      locale: OG_LOCALES[lang],
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALES[l]),
      images: ["/seo/og.jpg"],
      type: "website",
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <html lang={lang} className={`h-full antialiased ${geologica.variable} ${caveat.variable}`}>
      <head>
        {["Casey-Regular"].map((name) => (
          <link
            key={name}
            rel="preload"
            as="font"
            type="font/woff2"
            href={`/fonts/${name}.woff2`}
            crossOrigin="anonymous"
          />
        ))}
      </head>
      <body className="min-h-full bg-cream text-charcoal">
        <I18nProvider locale={lang}>
          <SmoothScroll>
            <CartProvider>
              {children}
              <CartButton />
              <CartDrawer />
            </CartProvider>
          </SmoothScroll>
        </I18nProvider>
      </body>
    </html>
  );
}
