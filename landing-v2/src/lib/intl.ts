// Number and date formatting by the dictionary's `intl` tag. Uzbek is done by
// hand: desktop Chrome ships without Uzbek locale data, so Intl there formats
// "250,000" and "M10 4, Sun" while Node prints "250 000" — a hydration
// mismatch as well as plain wrong text.

const isUz = (intl: string) => intl.startsWith("uz");

const UZ_MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
const UZ_WEEKDAYS = ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"];
const UZ_WEEKDAYS_SHORT = ["yak", "dush", "sesh", "chor", "pay", "jum", "shan"];

/** "250 000" (digit groups split by a no-break space, as in Russian). */
export function formatNumber(intl: string, n: number) {
  if (!isUz(intl)) return new Intl.NumberFormat(intl).format(n);
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** Full weekday name: "понедельник", "Monday", "dushanba". */
export function formatWeekday(intl: string, date: Date) {
  if (isUz(intl)) return UZ_WEEKDAYS[date.getDay()];
  return new Intl.DateTimeFormat(intl, { weekday: "long" }).format(date);
}

/** Short weekday, day, month and time: "пт, 9 октября, 18:00" / "jum, 9-oktabr, 18:00". */
export function formatMoment(intl: string, date: Date) {
  if (isUz(intl)) {
    const time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    return `${UZ_WEEKDAYS_SHORT[date.getDay()]}, ${date.getDate()}-${UZ_MONTHS[date.getMonth()]}, ${time}`;
  }
  return new Intl.DateTimeFormat(intl, {
    weekday: "short",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
