import type { Locale } from "@/i18n/config";

export interface CatalogProduct {
  id: string;
  name: string;
  /** English name; the page passes the localized one down as `name` */
  nameEn?: string;
  /** цена аренды за сутки, сум */
  price: number;
  /** only for prices not per day (e.g. "за прокат"); per-day is the default the catalog lead states */
  priceNote?: string;
  images: string[];
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
export const CATALOG: CatalogProduct[] = [
  // Палатки
  {
    id: "1",
    name: "Палатка 8 мест",
    nameEn: "8-person tent",
    price: 250000,
    images: photos("Палатки/Палатка 8 мест", 1, 2, 3, 4, 5, 6),
  },
  {
    id: "2",
    name: "Палатка 5 мест",
    nameEn: "5-person tent",
    price: 150000,
    images: photos("Палатки/Палатка 5 мест", 1, 2, 3, 4, 5),
  },
  {
    id: "3",
    name: "Палатка 4 места",
    nameEn: "4-person tent",
    price: 120000,
    images: photos("Палатки/Палатка 4 места", 1, 2, 3, 4),
  },
  // Мебель
  {
    id: "4",
    name: "Комплект: 4 стула + 1 стол",
    nameEn: "Set: 4 chairs + 1 table",
    price: 140000,
    images: photos("Мебель/Комплект 4 стула 1 стол", 1, 2, 3, 4, 5),
  },
  {
    id: "5",
    name: "Стол JEEP 1,20 м",
    nameEn: "JEEP table, 1.20 m",
    price: 40000,
    images: photos("Мебель/Стол JEEP", 1),
  },
  { id: "6", name: "Стул Camel", nameEn: "Camel chair", price: 25000, images: photos("Мебель/Стул Camel", 1) },
  // Сон и комфорт
  {
    id: "7",
    name: "Спальный мешок",
    nameEn: "Sleeping bag",
    price: 40000,
    images: photos("Сон и комфорт/Спальный мешок", 1, 2, 3, 4, 5),
  },
  {
    id: "8",
    name: "Каремат",
    nameEn: "Sleeping mat",
    price: 30000,
    images: photos("Сон и комфорт/Каремат", 1, 2, 3, 4, 5),
  },
  // Треккинг
  {
    id: "10",
    name: "Трекинговые палки",
    nameEn: "Trekking poles",
    price: 30000,
    images: photos("Треккинг/Треккинговые палки", 1, 2, 3, 4, 5),
  },
  {
    id: "9",
    name: "Рюкзак 65 л",
    nameEn: "Backpack, 65 L",
    price: 50000,
    images: photos("Треккинг/Рюкзак 60L", 1, 2, 3, 4, 5, 6, 7),
  },
  // Кухня и готовка
  {
    id: "13",
    name: "Баллон",
    nameEn: "Gas canister",
    price: 40000,
    images: photos("Кухня и готовка/Горелка/Баллон", 1, 2),
  },
  {
    id: "12",
    name: "Комфорка (мини-плита)",
    nameEn: "Portable gas stove",
    price: 40000,
    images: photos("Кухня и готовка/Комфорка (мини плита)", 1, 2, 3, 4),
  },
  {
    id: "11",
    name: "Газовая горелка 1 л",
    nameEn: "Gas burner, 1 L",
    price: 40000,
    images: photos("Кухня и готовка/Горелка", 1, 2, 3, 4),
  },
  // Свет и энергия
  {
    id: "14",
    name: "Power Bank 20 000 mAh",
    nameEn: "Power bank, 20,000 mAh",
    price: 40000,
    images: photos("Свет и энергия/Power bank 20.000", 1, 2, 3, 4, 5),
  },
  {
    id: "16",
    name: "Фонарь ручной",
    nameEn: "Flashlight",
    price: 30000,
    images: photos("Свет и энергия/Фонарь ручной", 1, 2, 3, 4),
  },
  {
    id: "15",
    name: "Фонарь налобный",
    nameEn: "Headlamp",
    price: 20000,
    images: photos("Свет и энергия/Фонарь налобный", 1, 2, 3, 4, 5),
  },
  {
    id: "17",
    name: "Ночник",
    nameEn: "Night light",
    price: 15000,
    images: photos("Свет и энергия/Ночник", 1, 2, 3, 4, 5),
  },
  // Посуда
  // Pan, kettle and pot are rented as a set
  {
    id: "cookset-1",
    name: "Набор посуды",
    nameEn: "Cookware set",
    price: 45000,
    images: photos("Посуда/Комплект посуды 1", 1, 2, 3, 4, 5),
  },
  {
    id: "cookset-2",
    name: "Набор посуды Jeep",
    nameEn: "Jeep cookware set",
    price: 45000,
    images: photos("Посуда/Комплект посуды 2", 1, 2, 3, 4, 5),
  },
  {
    id: "21",
    name: "Стенки от ветра",
    nameEn: "Windscreen",
    price: 20000,
    images: photos("Кухня и готовка/Стенки от ветра", 1, 2, 3, 4),
  },
];

/** The catalog with names in the page's language. */
export function getCatalog(locale: Locale): CatalogProduct[] {
  return CATALOG.map(({ nameEn, ...p }) => (locale === "en" && nameEn ? { ...p, name: nameEn } : p));
}
