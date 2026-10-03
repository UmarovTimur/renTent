import type { Locale } from "@/i18n/config";

export const CATEGORIES = ["tents", "camp", "trekking", "kitchen", "light"] as const;
export type CatalogCategory = (typeof CATEGORIES)[number];

export interface CatalogProduct {
  id: string;
  /** URL segment of the product page, from the English name */
  slug: string;
  category: CatalogCategory;
  name: string;
  /** English name; the page passes the localized one down as `name` */
  nameEn?: string;
  /** цена аренды за сутки, сум */
  price: number;
  /** only for prices not per day (e.g. "за прокат"); per-day is the default the catalog lead states */
  priceNote?: string;
  images: string[];
  description: string;
  descriptionEn?: string;
  /** How-to videos (setting up the tent etc.), each with a download button in the product dialog */
  videos?: ProductVideo[];
}

export interface ProductVideo {
  /** path under public/, e.g. /videos/tent-8-setup.mp4 */
  src: string;
  title: string;
  titleEn?: string;
}

/** Photos `n…` of a product folder in public/images/rent_photos, in order. */
function photos(folder: string, ...numbers: number[]) {
  return numbers.map((n) => encodeURI(`/images/rent_photos/${folder}/${n}.jpg`));
}

/**
 * Rental catalog — the products of the rent backend (ids, names and per-day
 * prices as in GET /api/v1/product/), grouped by category in the admin's
 * order, with photos from public/images/rent_photos. Static, so the site
 * doesn't depend on the API being up.
 */
const PRODUCTS: Omit<CatalogProduct, "slug">[] = [
  // Палатки
  {
    id: "1",
    category: "tents",
    name: "Палатка 8 мест",
    nameEn: "8-person tent",
    price: 250000,
    images: photos("Палатки/Палатка 8 мест", 1, 2, 3, 4, 5, 6),
    description: "Вместительная палатка на 8 человек",
    descriptionEn: "Roomy tent for 8 people",
  },
  {
    id: "2",
    category: "tents",
    name: "Палатка 5 мест",
    nameEn: "5-person tent",
    price: 150000,
    images: photos("Палатки/Палатка 5 мест", 1, 2, 3, 4, 5),
    description: "Палатка на 5 человек",
    descriptionEn: "Tent for 5 people",
  },
  {
    id: "3",
    category: "tents",
    name: "Палатка 4 места",
    nameEn: "4-person tent",
    price: 120000,
    images: photos("Палатки/Палатка 4 места", 1, 2, 3, 4),
    description: "Палатка на 4 человека",
    descriptionEn: "Tent for 4 people",
  },
  // Мебель
  {
    id: "4",
    category: "camp",
    name: "Комплект: 4 стула + 1 стол",
    nameEn: "Set: 4 chairs + 1 table",
    price: 140000,
    images: photos("Мебель/Комплект 4 стула 1 стол", 1, 2, 3, 4, 5),
    description: "Набор кемпинговой мебели: складной стол и 4 стула",
    descriptionEn: "Camping furniture set: a folding table and 4 chairs",
  },
  {
    id: "5",
    category: "camp",
    name: "Стол JEEP 1,20 м",
    nameEn: "JEEP table, 1.20 m",
    price: 40000,
    images: photos("Мебель/Стол JEEP", 1),
    description: "Складной стол JEEP длиной 1,20 м",
    descriptionEn: "Folding JEEP table, 1.20 m long",
  },
  { id: "6",
    category: "camp", name: "Стул Camel", nameEn: "Camel chair", price: 25000, images: photos("Мебель/Стул Camel", 1), description: "Складной стул Camel", descriptionEn: "Folding Camel chair" },
  // Сон и комфорт
  {
    id: "7",
    category: "camp",
    name: "Спальный мешок",
    nameEn: "Sleeping bag",
    price: 40000,
    images: photos("Сон и комфорт/Спальный мешок", 1, 2, 3, 4, 5),
    description: "Спальный мешок",
    descriptionEn: "Sleeping bag",
  },
  {
    id: "8",
    category: "camp",
    name: "Каремат",
    nameEn: "Sleeping mat",
    price: 30000,
    images: photos("Сон и комфорт/Каремат", 1, 2, 3, 4, 5),
    description: "Туристический каремат",
    descriptionEn: "Camping sleeping mat",
  },
  // Треккинг
  {
    id: "10",
    category: "trekking",
    name: "Трекинговые палки",
    nameEn: "Trekking poles",
    price: 30000,
    images: photos("Треккинг/Треккинговые палки", 1, 2, 3, 4, 5),
    description: "Палки для треккинга",
    descriptionEn: "Trekking poles",
  },
  {
    id: "9",
    category: "trekking",
    name: "Рюкзак 65 л",
    nameEn: "Backpack, 65 L",
    price: 50000,
    images: photos("Треккинг/Рюкзак 60L", 1, 2, 3, 4, 5, 6, 7),
    description: "Рюкзак объёмом 65 литров",
    descriptionEn: "65-litre backpack",
  },
  // Кухня и готовка
  {
    id: "13",
    category: "kitchen",
    name: "Баллон",
    nameEn: "Gas canister",
    price: 40000,
    images: photos("Кухня и готовка/Горелка/Баллон", 1, 2),
    description: "Газовый баллон",
    descriptionEn: "Gas canister",
  },
  {
    id: "12",
    category: "kitchen",
    name: "Комфорка (мини-плита)",
    nameEn: "Portable gas stove",
    price: 40000,
    images: photos("Кухня и готовка/Комфорка (мини плита)", 1, 2, 3, 4),
    description: "Мини-плита для кемпинга",
    descriptionEn: "Portable camping stove",
  },
  {
    id: "11",
    category: "kitchen",
    name: "Газовая горелка 1 л",
    nameEn: "Gas burner, 1 L",
    price: 40000,
    images: photos("Кухня и готовка/Горелка", 1, 2, 3, 4),
    description: "Газовая горелка 1 л (без баллона)",
    descriptionEn: "Gas burner, 1 L (canister not included)",
  },
  // Свет и энергия
  {
    id: "14",
    category: "light",
    name: "Power Bank 20 000 mAh",
    nameEn: "Power bank, 20,000 mAh",
    price: 40000,
    images: photos("Свет и энергия/Power bank 20.000", 1, 2, 3, 4, 5),
    description: "Портативный аккумулятор 20 000 mAh",
    descriptionEn: "Portable battery, 20,000 mAh",
  },
  {
    id: "16",
    category: "light",
    name: "Фонарь ручной",
    nameEn: "Flashlight",
    price: 30000,
    images: photos("Свет и энергия/Фонарь ручной", 1, 2, 3, 4),
    description: "Ручной фонарь",
    descriptionEn: "Hand flashlight",
  },
  {
    id: "15",
    category: "light",
    name: "Фонарь налобный",
    nameEn: "Headlamp",
    price: 20000,
    images: photos("Свет и энергия/Фонарь налобный", 1, 2, 3, 4, 5),
    description: "Налобный фонарь",
    descriptionEn: "Headlamp",
  },
  {
    id: "17",
    category: "light",
    name: "Ночник",
    nameEn: "Night light",
    price: 15000,
    images: photos("Свет и энергия/Ночник", 1, 2, 3, 4, 5),
    description: "Кемпинговый ночник",
    descriptionEn: "Camping night light",
  },
  // Посуда
  // Pan, kettle and pot are rented as a set
  {
    id: "cookset-1",
    category: "kitchen",
    name: "Набор посуды",
    nameEn: "Cookware set",
    price: 45000,
    images: photos("Посуда/Комплект посуды 1", 1, 2, 3, 4, 5),
    description: "Туристическая сковорода, чайник 1,6 л и кастрюля 3,6 л",
    descriptionEn: "Camping pan, 1.6 L kettle and 3.6 L pot",
  },
  {
    id: "cookset-2",
    category: "kitchen",
    name: "Набор посуды Jeep",
    nameEn: "Jeep cookware set",
    price: 45000,
    images: photos("Посуда/Комплект посуды 2", 1, 2, 3, 4, 5),
    description: "Сковорода, чайник 1,6 л и кастрюля 3,6 л Jeep",
    descriptionEn: "Jeep pan, 1.6 L kettle and 3.6 L pot",
  },
  {
    id: "21",
    category: "kitchen",
    name: "Стенки от ветра",
    nameEn: "Windscreen",
    price: 20000,
    images: photos("Кухня и готовка/Стенки от ветра", 1, 2, 3, 4),
    description: "Ветрозащитные стенки для горелки",
    descriptionEn: "Windscreen for the burner",
  },
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const CATALOG: CatalogProduct[] = PRODUCTS.map((p) => ({ ...p, slug: slugify(p.nameEn ?? p.id) }));

/** The catalog with names, descriptions and video titles in the page's language. */
export function getCatalog(locale: Locale): CatalogProduct[] {
  if (locale !== "en") return CATALOG;
  return CATALOG.map(({ nameEn, descriptionEn, videos, ...p }) => ({
    ...p,
    name: nameEn ?? p.name,
    description: descriptionEn ?? p.description,
    videos: videos?.map(({ titleEn, ...v }) => ({ ...v, title: titleEn ?? v.title })),
  }));
}
