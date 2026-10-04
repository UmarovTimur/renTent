import type { Locale } from "@/i18n/config";
import { en } from "@/i18n/en";
import { ru, type Dictionary } from "@/i18n/ru";
import { uz } from "@/i18n/uz";

export const DICTIONARIES: Record<Locale, Dictionary> = { ru, uz, en };

export const getDictionary = (locale: Locale) => DICTIONARIES[locale];

export type { Dictionary };
