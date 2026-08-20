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
    navLabel: "Палатки",
    cover: {
      headline: "Удобные палатки от 2 до 12 мест",
      location: "Biescas  42,69724° N, 0,35672° O",
      category: "Палатки",
      image: "/images/rent/lifestyle-tent-lake.jpg",
    },
    divider: {
      title: "Палатки для похода",
      cards: [
        "/images/rent/card-tent-3.jpg",
        "/images/rent/card-tent-4.jpg",
        "/images/rent/card-tent-5.jpg",
        "/images/rent/card-tent-8.jpg",
      ],
    },
    intro: {
      heading: "От компактной до семейной",
      products: [
        { code: "Палатка 2 места", tagline: "Лёгкая и компактная — для двоих в любом походе." },
        {
          code: "Палатка 12 мест",
          tagline: "Просторная, для большой компании или всей семьи.",
        },
      ],
    },
    products: [
      {
        code: "Палатка 2 места",
        tagline: "Лёгкая и компактная — для двоих в любом походе.",
        detail:
          "Палатка на 2 места создана для лёгких походов — компактная в сборе, быстро устанавливается и весит всего 2,1 кг. Отличный выбор для пары или соло-путешественника, который ценит мобильность и не готов жертвовать комфортом ночёвки.",
        packshot: "/images/rent/lifestyle-tent-2-meadow.jpg",
      },
      {
        code: "Палатка 12 мест",
        tagline: "Просторная, для большой компании или всей семьи.",
        detail:
          "Палатка на 12 мест — это полноценный дом на природе: несколько спальных отсеков, высокий потолок в полный рост и общая гостиная зона. Идеальна для семейного отдыха или похода большой компанией, когда никто не хочет спать в тесноте.",
        packshot: "/images/rent/lifestyle-tent-12-forest.jpg",
      },
    ],
    outfits: [
      {
        audience: "Мужчинам",
        background: "/images/jacket/bg-men.jpg",
        variants: [
          {
            code: "MH500",
            colorwayCount: "4 расцветки",
            colorways: [
              { name: "Чёрный", swatch: "#2a2928", image: "/images/products/jacket/men/default/jacket-men-default-01.png" },
              { name: "Сланцево-серый", swatch: "#5b616b", image: "/images/products/jacket/men/variant/jacket-men-variant-01.png" },
            ],
          },
          {
            code: "MH900",
            colorwayCount: "2 расцветки",
            colorways: [
              { name: "Оливковый", swatch: "#7c7b53", image: "/images/products/jacket/men/default/jacket-men-default-03.png" },
            ],
          },
        ],
      },
      {
        audience: "Женщинам",
        background: "/images/jacket/bg-women.jpg",
        variants: [
          {
            code: "MH500",
            colorwayCount: "3 расцветки",
            colorways: [
              { name: "Бежевый", swatch: "#d8cbb0", image: "/images/products/jacket/women/default/jacket-women-default-01.png" },
              { name: "Нежно-фиолетовый", swatch: "#b3a3d1", image: "/images/products/jacket/women/variant/jacket-women-variant-01.png" },
            ],
          },
        ],
      },
    ],
  },
  {
    index: 2,
    navLabel: "Обувь",
    cover: {
      headline: "Шаг за шагом к вершине",
      location: "Bielsa  42,68233° N, 0,13052° E",
      category: "Обувь MH500",
      image: "/images/shoes/chapter-bg.jpg",
    },
    divider: {
      title: "Обувь MH500",
      cards: [
        "/images/shoes/detail-1.jpg",
        "/images/shoes/bg-men.jpg",
        "/images/shoes/bg-women.jpg",
        "/images/shoes/detail-2.jpg",
      ],
    },
    intro: {
      heading: "Пусть каждый шаг ведёт к новым горизонтам",
      products: [
        { code: "Обувь MH500 Light", tagline: "Пусть каждый шаг ведёт к новым горизонтам." },
        {
          code: "Уникальный дизайн для смелых",
          tagline: "Скоро: лимитированная серия MH500 Light для туристов со стилем.",
        },
      ],
    },
    products: [
      {
        code: "MH500 Light",
        tagline: "Пусть каждый шаг ведёт к новым горизонтам.",
        detail:
          "Готовы сопровождать вас в любых приключениях — эти сверхлёгкие ботинки созданы для непревзойдённого комфорта, сцепления и выносливости на летних маршрутах. Нога чувствует себя уверенно, а точная шнуровка и мягкий язычок дают полный контроль на любом рельефе.",
        packshot: "/images/shoes/le.png",
      },
      {
        code: "Лимитированная серия",
        tagline: "Уникальный дизайн для смелых искателей приключений.",
        detail:
          "Скоро: лимитированная серия MH500 Light для туристов со стилем. Запоминающийся дизайн, который выделит вас на любой тропе, без потери комфорта и сцепления, на которые вы рассчитываете.",
        packshot: "/images/shoes/features.png",
      },
    ],
    outfits: [
      {
        audience: "Мужчинам",
        background: "/images/shoes/bg-men.jpg",
        variants: [
          {
            code: "MH500 Light",
            colorwayCount: "2 расцветки",
            colorways: [
              { name: "Хаки-чёрный", swatch: "#6b6a4f", image: "/images/products/shoes/men/default/shoes-men-default-01.png" },
              { name: "Серый", swatch: "#9aa0a6", image: "/images/products/shoes/men/default/shoes-men-default-03.png" },
            ],
          },
        ],
      },
      {
        audience: "Женщинам",
        background: "/images/shoes/bg-women.jpg",
        variants: [
          {
            code: "MH500 Light",
            colorwayCount: "2 расцветки",
            colorways: [
              { name: "Фиолетово-оранжевый", swatch: "#8a6f9e", image: "/images/products/shoes/women/default/shoes-women-default-01.png" },
              { name: "Синий", swatch: "#7d93b8", image: "/images/products/shoes/women/default/shoes-women-default-03.png" },
            ],
          },
        ],
      },
    ],
  },
  {
    index: 3,
    navLabel: "Рюкзаки",
    cover: {
      headline: "Дух приключений",
      location: "Estadilla  42,04948° N, 0,30224° E",
      category: "Рюкзак MH500",
      image: "/images/backpack/chapter-bg.jpg",
    },
    divider: {
      title: "Рюкзак MH500",
      cards: [
        "/images/backpack/bg-25l.jpg",
        "/images/backpack/bg-38l.jpg",
        "/images/intro/wide.jpg",
        "/images/shoes/bg-men.jpg",
      ],
    },
    intro: {
      heading: "Ваш путь налегке",
      products: [
        { code: "Рюкзак MH500", tagline: "Для лёгких походов." },
        { code: "Рюкзак MH500", tagline: "Ваш путь налегке." },
      ],
    },
    products: [
      {
        code: "25L",
        tagline: "Для лёгких походов.",
        detail:
          "Рюкзак MH500 создан для современного исследователя — сочетает лаконичный стиль, передовые технологии и лёгкий вес. Готов к любым приключениям, от тропы до города, доступен в разных цветах и рассчитан на долгий срок службы. Его легко починить, что делает его надёжным спутником на годы.",
        packshot: "/images/backpack/25l.png",
      },
      {
        code: "38L",
        tagline: "Ваш путь налегке.",
        detail:
          "Рюкзак MH500 38L создан для более длительных походов — идеальный спутник для тех, кому нужен дополнительный объём без потери комфорта. Просторный и продуманный, он отлично подходит для семейных походов и ночёвок в горных приютах. Доступен в разных цветах, чтобы выбрать стиль под себя.",
        packshot: "/images/backpack/38l.png",
      },
    ],
    outfits: [
      {
        audience: "Унисекс",
        background: "/images/backpack/bg-25l.jpg",
        variants: [
          {
            code: "25L",
            colorwayCount: "5 расцветок",
            colorways: [
              { name: "Медно-коричневый", swatch: "#9c6b4f", image: "/images/products/backpack/men/default/backpack-men-default-01.png" },
              { name: "Хаки", swatch: "#5f6350", image: "/images/products/backpack/men/variant/backpack-men-variant-01.png" },
            ],
          },
          {
            code: "38L",
            colorwayCount: "4 расцветки",
            colorways: [
              { name: "Медно-коричневый", swatch: "#9c6b4f", image: "/images/products/backpack/men/default/backpack-men-default-03.png" },
              { name: "Хаки", swatch: "#5f6350", image: "/images/products/backpack/men/variant/backpack-men-variant-03.png" },
            ],
          },
        ],
      },
    ],
  },
];
