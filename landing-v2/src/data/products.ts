import type { Locale } from "@/i18n/config";

export const CATEGORIES = ["tents", "camp", "trekking", "kitchen", "light"] as const;
export type CatalogCategory = (typeof CATEGORIES)[number];

export interface CatalogProduct {
  id: string;
  /** URL segment of the product page, from the English name */
  slug: string;
  category: CatalogCategory;
  name: string;
  /** English and Uzbek names; the page passes the localized one down as `name` */
  nameEn?: string;
  nameUz?: string;
  /** цена аренды за сутки, сум */
  price: number;
  /** only for prices not per day (e.g. "за прокат"); per-day is the default the catalog lead states */
  priceNote?: string;
  images: string[];
  description: string;
  descriptionEn?: string;
  descriptionUz?: string;
  /** How-to videos (setting up the tent etc.), each with a download button in the product dialog */
  videos?: ProductVideo[];
}

export interface ProductVideo {
  /** path under public/, e.g. /videos/tent-8-setup.mp4 */
  src: string;
  title: string;
  titleEn?: string;
  titleUz?: string;
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
    nameUz: "8 o‘rinli chodir",
    nameEn: "8-person tent",
    price: 250000,
    images: photos("Палатки/Палатка 8 мест", 1, 2, 3, 4, 5, 6),
    description: "Вместительная палатка на 8 человек",
    descriptionUz: "8 kishilik keng chodir",
    descriptionEn: "Roomy tent for 8 people",
  },
  {
    id: "2",
    category: "tents",
    name: "Палатка 5 мест",
    nameUz: "5 o‘rinli chodir",
    nameEn: "5-person tent",
    price: 150000,
    images: photos("Палатки/Палатка 5 мест", 1, 2, 3, 4, 5),
    description: "Палатка на 5 человек",
    descriptionUz: "5 kishilik chodir",
    descriptionEn: "Tent for 5 people",
  },
  {
    id: "3",
    category: "tents",
    name: "Палатка 4 места",
    nameUz: "4 o‘rinli chodir",
    nameEn: "4-person tent",
    price: 120000,
    images: photos("Палатки/Палатка 4 места", 1, 2, 3, 4),
    description: "Палатка на 4 человека",
    descriptionUz: "4 kishilik chodir",
    descriptionEn: "Tent for 4 people",
  },
  // Мебель
  {
    id: "4",
    category: "camp",
    name: "Комплект: 4 стула + 1 стол",
    nameUz: "To‘plam: 4 ta stul + 1 ta stol",
    nameEn: "Set: 4 chairs + 1 table",
    price: 140000,
    images: photos("Мебель/Комплект 4 стула 1 стол", 1, 2, 3, 4, 5),
    description: "Набор кемпинговой мебели: складной стол и 4 стула",
    descriptionUz: "Kemping mebellari to‘plami: yig‘ma stol va 4 ta stul",
    descriptionEn: "Camping furniture set: a folding table and 4 chairs",
  },
  {
    id: "5",
    category: "camp",
    name: "Стол JEEP 1,20 м",
    nameUz: "JEEP stoli, 1,20 m",
    nameEn: "JEEP table, 1.20 m",
    price: 40000,
    images: photos("Мебель/Стол JEEP", 1),
    description: "Складной стол JEEP длиной 1,20 м",
    descriptionUz: "Uzunligi 1,20 m bo‘lgan JEEP yig‘ma stoli",
    descriptionEn: "Folding JEEP table, 1.20 m long",
  },
  { id: "6",
    category: "camp", name: "Стул Camel", nameUz: "Camel stuli", nameEn: "Camel chair", price: 25000, images: photos("Мебель/Стул Camel", 1), description: "Складной стул Camel", descriptionUz: "Camel yig‘ma stuli", descriptionEn: "Folding Camel chair" },
  // Сон и комфорт
  {
    id: "7",
    category: "camp",
    name: "Спальный мешок",
    nameUz: "Uxlash qopi",
    nameEn: "Sleeping bag",
    price: 40000,
    images: photos("Сон и комфорт/Спальный мешок", 1, 2, 3, 4, 5),
    description: "Спальный мешок",
    descriptionUz: "Uxlash qopi",
    descriptionEn: "Sleeping bag",
  },
  {
    id: "8",
    category: "camp",
    name: "Каремат",
    nameUz: "Karemat",
    nameEn: "Sleeping mat",
    price: 30000,
    images: photos("Сон и комфорт/Каремат", 1, 2, 3, 4, 5),
    description: "Туристический каремат",
    descriptionUz: "Turistik karemat",
    descriptionEn: "Camping sleeping mat",
  },
  // Треккинг
  {
    id: "10",
    category: "trekking",
    name: "Трекинговые палки",
    nameUz: "Treking tayoqlari",
    nameEn: "Trekking poles",
    price: 30000,
    images: photos("Треккинг/Треккинговые палки", 1, 2, 3, 4, 5),
    description: "Палки для треккинга",
    descriptionUz: "Treking uchun tayoqlar",
    descriptionEn: "Trekking poles",
  },
  {
    id: "9",
    category: "trekking",
    name: "Рюкзак 65 л",
    nameUz: "Ryukzak, 65 l",
    nameEn: "Backpack, 65 L",
    price: 50000,
    images: photos("Треккинг/Рюкзак 60L", 1, 2, 3, 4, 5, 6, 7),
    description: "Рюкзак объёмом 65 литров",
    descriptionUz: "Hajmi 65 litr bo‘lgan ryukzak",
    descriptionEn: "65-litre backpack",
  },
  // Кухня и готовка
  {
    id: "13",
    category: "kitchen",
    name: "Баллон",
    nameUz: "Gaz balloni",
    nameEn: "Gas canister",
    price: 40000,
    images: photos("Кухня и готовка/Горелка/Баллон", 1, 2),
    description: "Газовый баллон",
    descriptionUz: "Gaz balloni",
    descriptionEn: "Gas canister",
  },
  {
    id: "12",
    category: "kitchen",
    name: "Комфорка (мини-плита)",
    nameUz: "Komforka (mini-plita)",
    nameEn: "Portable gas stove",
    price: 40000,
    images: photos("Кухня и готовка/Комфорка (мини плита)", 1, 2, 3, 4),
    description: "Мини-плита для кемпинга",
    descriptionUz: "Kemping uchun mini-plita",
    descriptionEn: "Portable camping stove",
  },
  {
    id: "11",
    category: "kitchen",
    name: "Газовая горелка 1 л",
    nameUz: "Gaz gorelkasi, 1 l",
    nameEn: "Gas burner, 1 L",
    price: 40000,
    images: photos("Кухня и готовка/Горелка", 1, 2, 3, 4),
    description: "Газовая горелка 1 л (без баллона)",
    descriptionUz: "Gaz gorelkasi, 1 l (ballonsiz)",
    descriptionEn: "Gas burner, 1 L (canister not included)",
  },
  // Свет и энергия
  {
    id: "14",
    category: "light",
    name: "Power Bank 20 000 mAh",
    nameUz: "Power Bank 20 000 mAh",
    nameEn: "Power bank, 20,000 mAh",
    price: 40000,
    images: photos("Свет и энергия/Power bank 20.000", 1, 2, 3, 4, 5),
    description: "Портативный аккумулятор 20 000 mAh",
    descriptionUz: "20 000 mAh portativ akkumulyator",
    descriptionEn: "Portable battery, 20,000 mAh",
  },
  {
    id: "16",
    category: "light",
    name: "Фонарь ручной",
    nameUz: "Qo‘l fonari",
    nameEn: "Flashlight",
    price: 30000,
    images: photos("Свет и энергия/Фонарь ручной", 1, 2, 3, 4),
    description: "Ручной фонарь",
    descriptionUz: "Qo‘l fonari",
    descriptionEn: "Hand flashlight",
  },
  {
    id: "15",
    category: "light",
    name: "Фонарь налобный",
    nameUz: "Peshona fonari",
    nameEn: "Headlamp",
    price: 20000,
    images: photos("Свет и энергия/Фонарь налобный", 1, 2, 3, 4, 5),
    description: "Налобный фонарь",
    descriptionUz: "Peshona fonari",
    descriptionEn: "Headlamp",
  },
  {
    id: "17",
    category: "light",
    name: "Ночник",
    nameUz: "Tungi chiroq",
    nameEn: "Night light",
    price: 15000,
    images: photos("Свет и энергия/Ночник", 1, 2, 3, 4, 5),
    description: "Кемпинговый ночник",
    descriptionUz: "Kemping uchun tungi chiroq",
    descriptionEn: "Camping night light",
  },
  // Посуда
  // Pan, kettle and pot are rented as a set
  {
    id: "cookset-1",
    category: "kitchen",
    name: "Набор посуды",
    nameUz: "Idishlar to‘plami",
    nameEn: "Cookware set",
    price: 45000,
    images: photos("Посуда/Комплект посуды 1", 1, 2, 3, 4, 5),
    description: "Туристическая сковорода, чайник 1,6 л и кастрюля 3,6 л",
    descriptionUz: "Turistik tova, 1,6 litrli choynak va 3,6 litrli qozon",
    descriptionEn: "Camping pan, 1.6 L kettle and 3.6 L pot",
  },
  {
    id: "cookset-2",
    category: "kitchen",
    name: "Набор посуды Jeep",
    nameUz: "Jeep idishlar to‘plami",
    nameEn: "Jeep cookware set",
    price: 45000,
    images: photos("Посуда/Комплект посуды 2", 1, 2, 3, 4, 5),
    description: "Сковорода, чайник 1,6 л и кастрюля 3,6 л Jeep",
    descriptionUz: "Jeep tova, 1,6 litrli choynak va 3,6 litrli qozon",
    descriptionEn: "Jeep pan, 1.6 L kettle and 3.6 L pot",
  },
  {
    id: "21",
    category: "kitchen",
    name: "Стенки от ветра",
    nameUz: "Shamol to‘siqlari",
    nameEn: "Windscreen",
    price: 20000,
    images: photos("Кухня и готовка/Стенки от ветра", 1, 2, 3, 4),
    description: "Ветрозащитные стенки для горелки",
    descriptionUz: "Gorelka uchun shamoldan himoya to‘siqlari",
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
  if (locale === "ru") return CATALOG;
  const en = locale === "en";
  return CATALOG.map(({ nameEn, nameUz, descriptionEn, descriptionUz, videos, ...p }) => ({
    ...p,
    name: (en ? nameEn : nameUz) ?? p.name,
    description: (en ? descriptionEn : descriptionUz) ?? p.description,
    videos: videos?.map(({ titleEn, titleUz, ...v }) => ({ ...v, title: (en ? titleEn : titleUz) ?? v.title })),
  }));
}
