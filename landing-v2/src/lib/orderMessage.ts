import { MANAGER_TELEGRAM } from "@/lib/contacts";
import type { Dictionary } from "@/i18n";
import type { CatalogProduct } from "@/data/products";

export interface OrderLine {
  product: CatalogProduct;
  qty: number;
}

export interface OrderDates {
  pickup: Date;
  giveBack: Date;
  /** days to pay for, from getRentalSpan */
  days: number;
}

/** Sum of the per-day prices of every piece in the order. */
export const perDayTotal = (lines: OrderLine[]) => lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);

/**
 * The request as a plain-text Telegram message: dates and rental term, a
 * numbered gear list with per-day prices, the total and an optional comment.
 * Plain text only (a prefilled message can't carry markup), laid out with
 * blank lines and a few emoji so it reads at a glance.
 */
export function buildOrderMessage(
  t: Dictionary,
  lines: OrderLine[],
  dates: OrderDates | null,
  comment: string,
): string {
  const m = t.cart.message;
  const money = (n: number) => `${new Intl.NumberFormat(t.intl).format(n)} ${t.catalog.currency}`;
  const when = new Intl.DateTimeFormat(t.intl, {
    weekday: "short",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  const out = [m.greeting, ""];
  if (dates) {
    out.push(
      `📅 ${m.pickup}: ${when.format(dates.pickup)}`,
      `📅 ${m.giveBack}: ${when.format(dates.giveBack)}`,
      `⏱ ${m.term}: ${t.calc.formatDays(dates.days)}`,
      "",
    );
  }
  out.push(`🎒 ${m.items}:`);
  lines.forEach(({ product, qty }, i) => {
    out.push(`${i + 1}. ${product.name} × ${qty} · ${money(product.price * qty)}/${m.perDay}`);
  });
  const perDay = perDayTotal(lines);
  out.push(
    "",
    dates
      ? `💰 ${m.total}: ${money(perDay * dates.days)} (${t.cart.forDays(t.calc.formatDays(dates.days))})`
      : `💰 ${m.total}: ${money(perDay)}/${m.perDay}`,
  );
  if (comment.trim()) out.push("", `💬 ${m.comment}: ${comment.trim()}`);
  out.push("", m.question);
  return out.join("\n");
}

/** Opens the manager's chat with `text` already typed in the message box. */
export const telegramLink = (text: string) => `${MANAGER_TELEGRAM}?text=${encodeURIComponent(text)}`;
