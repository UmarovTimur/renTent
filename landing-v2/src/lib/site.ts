/** Public origin of the site: canonical URLs, hreflang, Open Graph, sitemap. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://rentent.uz").replace(/\/$/, "");

/** Brand name as written in the logo. */
export const SITE_NAME = "rentTent";

/** Absolute URL of a site path ("/catalog/x" → "https://rentent.uz/catalog/x"). */
export const absoluteUrl = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;
