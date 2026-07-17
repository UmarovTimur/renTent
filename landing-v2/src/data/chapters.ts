export interface Colorway {
  name: string;
  swatch: string;
  image: string;
}

export interface OutfitVariant {
  code: string;
  colorwayCount: string;
  colorways: Colorway[];
}

export interface Outfit {
  audience: string;
  background: string;
  variants: OutfitVariant[];
}

export interface ChapterProduct {
  code: string;
  tagline: string;
  detail: string;
  packshot: string;
}

export interface Chapter {
  index: number;
  navLabel: string;
  cover: {
    headline: string;
    location: string;
    category: string;
    image: string;
  };
  divider: {
    title: string;
    cards: string[];
  };
  intro: {
    heading: string;
    products: { code: string; tagline: string }[];
  };
  products: ChapterProduct[];
  outfits: Outfit[];
}

export const CHAPTERS: Chapter[] = [
  {
    index: 1,
    navLabel: "Jackets",
    cover: {
      headline: "Conquer new peaks",
      location: "Biescas  42,69724° N, 0,35672° O",
      category: "MH500 Jacket",
      image: "/images/jacket/chapter-bg.jpg",
    },
    divider: {
      title: "MH500 Jacket",
      cards: [
        "/images/intro/wide.jpg",
        "/images/intro/tracking.jpg",
        "/images/jacket/bg-men.jpg",
        "/images/jacket/bg-women.jpg",
      ],
    },
    intro: {
      heading: "Two jackets, one mountain spirit",
      products: [
        { code: "The MH500 Jacket", tagline: "A waterproof classic that’s built to last." },
        {
          code: "The MH900 Jacket",
          tagline: "Ultra-light, high-tech performance to gear up for the unexpected.",
        },
      ],
    },
    products: [
      {
        code: "MH500",
        tagline: "A waterproof classic that’s built to last.",
        detail:
          "Engineered for explorers, the MH500 jacket combines top-tier performance with sleek design, keeping you ready for any adventure, rain or shine. Whether you’re hitting the trails or adding an outdoor edge to your everyday look, this jacket is built to keep you dry, comfortable and stylish whatever the weather.",
        packshot: "/images/jacket/mh500-black.jpg",
      },
      {
        code: "MH900",
        tagline: "Ultra-light, high-tech performance to gear up for the unexpected.",
        detail:
          "The MH900 jacket isn’t just a rain protector, it’s the result of countless hours of design and testing to create the ultimate outdoor companion. With a sleek, balanced fit, the MH900 blends high-tech features with timeless design, ensuring it’s not only a piece of gear but a stylish go-to staple for every adventure.",
        packshot: "/images/jacket/mh900-black.jpg",
      },
    ],
    outfits: [
      {
        audience: "Men",
        background: "/images/jacket/bg-men.jpg",
        variants: [
          {
            code: "MH500",
            colorwayCount: "4 colorways",
            colorways: [
              { name: "Black", swatch: "#2a2928", image: "/images/products/jacket/men/default/jacket-men-default-01.png" },
              { name: "Slate grey", swatch: "#5b616b", image: "/images/products/jacket/men/variant/jacket-men-variant-01.png" },
            ],
          },
          {
            code: "MH900",
            colorwayCount: "2 colorways",
            colorways: [
              { name: "Olive", swatch: "#7c7b53", image: "/images/products/jacket/men/default/jacket-men-default-03.png" },
            ],
          },
        ],
      },
      {
        audience: "Women",
        background: "/images/jacket/bg-women.jpg",
        variants: [
          {
            code: "MH500",
            colorwayCount: "3 colorways",
            colorways: [
              { name: "Beige", swatch: "#d8cbb0", image: "/images/products/jacket/women/default/jacket-women-default-01.png" },
              { name: "Sweet purple", swatch: "#b3a3d1", image: "/images/products/jacket/women/variant/jacket-women-variant-01.png" },
            ],
          },
        ],
      },
    ],
  },
  {
    index: 2,
    navLabel: "Shoes",
    cover: {
      headline: "Step on up",
      location: "Bielsa  42,68233° N, 0,13052° E",
      category: "MH500 Shoes",
      image: "/images/shoes/chapter-bg.jpg",
    },
    divider: {
      title: "MH500 Shoes",
      cards: [
        "/images/shoes/detail-1.jpg",
        "/images/shoes/bg-men.jpg",
        "/images/shoes/bg-women.jpg",
        "/images/shoes/detail-2.jpg",
      ],
    },
    intro: {
      heading: "Let every step lead you to new horizons",
      products: [
        { code: "The MH500 Light shoes", tagline: "Let every step lead you to new horizons." },
        {
          code: "Unique designs for bold adventurers",
          tagline: "Stay tuned for the MH500 Light limited edition, crafted for hikers with flair.",
        },
      ],
    },
    products: [
      {
        code: "MH500 Light",
        tagline: "Let every step lead you to new horizons.",
        detail:
          "Ready to accompany you on all your adventures, these ultralight shoes are designed to deliver unmatched comfort, performance, and grip throughout your summer hikes. “The first thing that surprises you with the MH500 shoes is how comfortable it is. Your foot feels perfectly snug, and the precision-fit lacing along with the cushioned tongue mean you’re in full control.” — Florent, Product Manager",
        packshot: "/images/shoes/le.png",
      },
      {
        code: "Limited edition",
        tagline: "Unique designs for bold adventurers.",
        detail:
          "Stay tuned for the MH500 Light limited edition, crafted for hikers with flair. A distinctive design that turns every trail into a statement, without compromising on the comfort and grip you count on.",
        packshot: "/images/shoes/features.png",
      },
    ],
    outfits: [
      {
        audience: "Men",
        background: "/images/shoes/bg-men.jpg",
        variants: [
          {
            code: "MH500 Light",
            colorwayCount: "2 colorways",
            colorways: [
              { name: "Khaki-Black", swatch: "#6b6a4f", image: "/images/products/shoes/men/default/shoes-men-default-01.png" },
              { name: "Grey", swatch: "#9aa0a6", image: "/images/products/shoes/men/default/shoes-men-default-03.png" },
            ],
          },
        ],
      },
      {
        audience: "Women",
        background: "/images/shoes/bg-women.jpg",
        variants: [
          {
            code: "MH500 Light",
            colorwayCount: "2 colorways",
            colorways: [
              { name: "Purple-Orange", swatch: "#8a6f9e", image: "/images/products/shoes/women/default/shoes-women-default-01.png" },
              { name: "Blue", swatch: "#7d93b8", image: "/images/products/shoes/women/default/shoes-women-default-03.png" },
            ],
          },
        ],
      },
    ],
  },
  {
    index: 3,
    navLabel: "Backpack",
    cover: {
      headline: "Outdoor spirit",
      location: "Estadilla  42,04948° N, 0,30224° E",
      category: "MH500 Backpack",
      image: "/images/backpack/chapter-bg.jpg",
    },
    divider: {
      title: "MH500 Backpack",
      cards: [
        "/images/backpack/bg-25l.jpg",
        "/images/backpack/bg-38l.jpg",
        "/images/intro/wide.jpg",
        "/images/shoes/bg-men.jpg",
      ],
    },
    intro: {
      heading: "Your journey, lightened",
      products: [
        { code: "The MH500 Backpack", tagline: "For lightweight hikes." },
        { code: "The MH500 Backpack", tagline: "Your journey, lightened." },
      ],
    },
    products: [
      {
        code: "25L",
        tagline: "For lightweight hikes.",
        detail:
          "Crafted for the modern explorer, the MH500 backpack blends timeless style with cutting-edge technology and lightweight performance. Built to handle every adventure, from the trail to the city, it’s available in a range of colors and designed for a lifetime of use. Not only is it made to last, it’s also easy to repair, making it the ultimate companion.",
        packshot: "/images/backpack/25l.png",
      },
      {
        code: "38L",
        tagline: "Your journey, lightened.",
        detail:
          "Designed for longer adventures, the MH500 38L backpack is the perfect companion for hikers needing extra capacity without sacrificing comfort. With its spacious design and smart storage solutions, it’s ideal for family hikes and overnight stays in mountain huts. Available in a range of colors, so you can choose the right style for your adventures.",
        packshot: "/images/backpack/38l.png",
      },
    ],
    outfits: [
      {
        audience: "Unisex",
        background: "/images/backpack/bg-25l.jpg",
        variants: [
          {
            code: "25L",
            colorwayCount: "5 colorways",
            colorways: [
              { name: "Copper brown", swatch: "#9c6b4f", image: "/images/products/backpack/men/default/backpack-men-default-01.png" },
              { name: "Mangrove Khaki", swatch: "#5f6350", image: "/images/products/backpack/men/variant/backpack-men-variant-01.png" },
            ],
          },
          {
            code: "38L",
            colorwayCount: "4 colorways",
            colorways: [
              { name: "Copper brown", swatch: "#9c6b4f", image: "/images/products/backpack/men/default/backpack-men-default-03.png" },
              { name: "Mangrove Khaki", swatch: "#5f6350", image: "/images/products/backpack/men/variant/backpack-men-variant-03.png" },
            ],
          },
        ],
      },
    ],
  },
];
