/* Content model for the Quechua SS25 lookbook. */

export interface Colorway {
  name: string;
  /** swatch color (CSS color) */
  swatch: string;
  /** product images shown for this colorway (front / detail frames) */
  images: string[];
}

export interface ProductVariant {
  /** e.g. "MH500", "MH900", "MH500 Light", "25L", "38L" */
  code: string;
  colorwayCount: string; // "4 colorways"
  colorways: Colorway[];
}

export interface OutfitPanel {
  /** "Men" | "Women" | "Unisex" */
  audience: string;
  variants: ProductVariant[];
  background: string; // background photo
}

export interface ChapterMeta {
  /** small kebab label shown in the nav pill */
  navLabel: string;
  /** big chapter headline, e.g. "Conquer new peaks" */
  headline: string;
  /** GPS-style location caption */
  location: string;
  /** category eyebrow, e.g. "MH500 Jacket" */
  category: string;
  chapterBackground: string;
}

export interface FeatureCard {
  code: string;
  title: string;
  description: string;
  video?: string;
  image?: string;
}
