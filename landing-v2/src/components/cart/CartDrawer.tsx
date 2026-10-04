"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog } from "@base-ui/react/dialog";
import { useLenis } from "lenis/react";
import { ImageOff, Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { TelegramIcon } from "@/components/icons";
import { buildOrderMessage, perDayTotal, telegramLink, type OrderLine } from "@/lib/orderMessage";
import { getRentalSpan } from "@/lib/rentalDays";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";
import { localeHome, productHref } from "@/i18n/config";
import { getCatalog } from "@/data/products";
import { formatNumber } from "@/lib/intl";

const FIELD =
  "w-full rounded-xl border border-charcoal/20 bg-white/50 px-3 py-2.5 font-text text-[0.95rem] outline-none transition-colors hover:border-charcoal/45 focus:border-charcoal";

/**
 * Cart as a sheet from the right: the chosen gear with quantities, the
 * pickup and return times (billed by the same rule as the calculator), a
 * comment, and a button that opens the manager's Telegram chat with the
 * whole request typed out.
 */
export function CartDrawer() {
  const { locale, t } = useI18n();
  const cart = useCart();
  const lenis = useLenis();
  const [pickup, setPickup] = useState("");
  const [giveBack, setGiveBack] = useState("");
  const [comment, setComment] = useState("");

  // Freeze the page behind, like the other dialogs
  useEffect(() => {
    if (!cart.open) return;
    lenis?.stop();
    return () => lenis?.start();
  }, [cart.open, lenis]);

  const catalog = getCatalog(locale);
  const lines: OrderLine[] = cart.items.flatMap(({ id, qty }) => {
    const product = catalog.find((p) => p.id === id);
    return product ? [{ product, qty }] : [];
  });
  const span = pickup && giveBack ? getRentalSpan(new Date(pickup), new Date(giveBack)) : null;
  const dates = span ? { pickup: new Date(pickup), giveBack: new Date(giveBack), days: span.billedDays } : null;
  const datesWrong = Boolean(pickup && giveBack && !span);
  const ready = lines.length > 0 && dates !== null;
  const money = (n: number) => `${formatNumber(t.intl, n)} ${t.catalog.currency}`;
  const perDay = perDayTotal(lines);

  return (
    <Dialog.Root open={cart.open} onOpenChange={cart.setOpen}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[100] bg-charcoal/50 backdrop-blur-sm transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        {/* A sheet that slides up from the bottom centre, where the cart pill sits */}
        <Dialog.Popup className="fixed bottom-0 left-1/2 z-[101] flex max-h-[min(90svh,52rem)] w-full max-w-[34rem] -translate-x-1/2 flex-col rounded-t-2xl bg-cream text-charcoal shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full sm:bottom-2 sm:w-[calc(100%-1rem)] sm:rounded-2xl sm:data-[ending-style]:translate-y-[calc(100%+0.5rem)] sm:data-[starting-style]:translate-y-[calc(100%+0.5rem)]">
          <div className="flex items-center justify-between gap-4 border-b border-charcoal/10 px-5 py-4">
            <Dialog.Title className="font-display text-2xl font-semibold tracking-[-0.02em]">
              {t.cart.title}
              {cart.count > 0 && <span className="ml-2 text-charcoal/40 tabular-nums">{cart.count}</span>}
            </Dialog.Title>
            <div className="flex items-center gap-2">
              {lines.length > 0 && (
                <button
                  type="button"
                  onClick={cart.clear}
                  className="rounded-lg px-2.5 py-1.5 font-text text-sm text-charcoal/60 transition-colors hover:bg-charcoal/5 hover:text-charcoal"
                >
                  {t.cart.clear}
                </button>
              )}
              <Dialog.Close
                aria-label={t.cart.close}
                className="flex size-10 items-center justify-center rounded-full border border-charcoal/20 transition-colors hover:bg-charcoal hover:text-cream"
              >
                <X className="size-5" />
              </Dialog.Close>
            </div>
          </div>

          {lines.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-14 text-center">
              <p className="font-display text-2xl font-medium">{t.cart.empty}</p>
              <p className="max-w-[20rem] font-text text-[0.95rem] text-charcoal/60">{t.cart.emptyHint}</p>
              <Link
                href={`${localeHome(locale)}#catalog`}
                onClick={() => cart.setOpen(false)}
                className="mt-3 rounded-full bg-charcoal px-5 py-2.5 font-display text-cream transition-opacity hover:opacity-80"
              >
                {t.cart.toCatalog}
              </Link>
            </div>
          ) : (
            <>
              {/* Only the item list scrolls; the dates, comment, total and send
                  button below stay pinned to the bottom of the sheet.
                  data-lenis-prevent: let the wheel scroll this box instead of the page */}
              <div data-lenis-prevent className="min-h-24 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
                <ul className="flex flex-col divide-y divide-charcoal/10">
                  {lines.map(({ product, qty }) => (
                    <li key={product.id} className="flex gap-3 py-3 first:pt-0">
                      <Link
                        href={productHref(locale, product.slug)}
                        onClick={() => cart.setOpen(false)}
                        className="relative aspect-[2/3] w-14 shrink-0 overflow-hidden rounded-lg bg-[#e6e1d8]"
                      >
                        {product.images[0] ? (
                          <Image src={product.images[0]} alt="" fill sizes="56px" className="object-cover" />
                        ) : (
                          <ImageOff className="absolute inset-0 m-auto size-5 text-charcoal/30" />
                        )}
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-display font-medium leading-tight">{product.name}</p>
                            <p className="mt-0.5 font-text text-sm tabular-nums text-charcoal/55">
                              {money(product.price)} {t.cart.perDay}
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-label={t.cart.remove}
                            onClick={() => cart.setQty(product.id, 0)}
                            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-charcoal/45 transition-colors hover:bg-charcoal/5 hover:text-charcoal"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        <QtyStepper
                          qty={qty}
                          onChange={(n) => cart.setQty(product.id, n)}
                          labels={{ decrease: t.cart.decrease, increase: t.cart.increase }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="shrink-0 border-t border-charcoal/10 px-5 py-4">
                <section>
                  <h3 className="font-display text-lg font-medium">{t.cart.dates}</h3>
                  <div className="mt-3 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                    <label className="flex flex-col gap-1.5">
                      <span className="font-text text-sm text-charcoal/60">{t.cart.pickup}</span>
                      <input type="datetime-local" value={pickup} onChange={(e) => setPickup(e.target.value)} className={FIELD} />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="font-text text-sm text-charcoal/60">{t.cart.giveBack}</span>
                      <input
                        type="datetime-local"
                        value={giveBack}
                        min={pickup || undefined}
                        onChange={(e) => setGiveBack(e.target.value)}
                        className={cn(FIELD, datesWrong && "border-red-700/60")}
                      />
                    </label>
                  </div>
                  <p className={cn("mt-2 font-text text-sm", datesWrong ? "text-red-800" : "text-charcoal/55")}>
                    {datesWrong ? t.cart.dateError : t.cart.weekendHint}
                  </p>
                </section>

                <label className="mt-4 flex flex-col gap-1.5">
                  <span className="font-display text-lg font-medium">{t.cart.comment}</span>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={2}
                    placeholder={t.cart.commentPlaceholder}
                    className={cn(FIELD, "resize-none placeholder:text-charcoal/40")}
                  />
                </label>
              </div>

              <div className="shrink-0 border-t border-charcoal/10 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-display text-lg">{t.cart.total}</span>
                  {dates ? (
                    <span className="text-right">
                      <span className="block font-display text-2xl font-semibold tabular-nums">{money(perDay * dates.days)}</span>
                      <span className="font-text text-sm text-charcoal/55">
                        {money(perDay)} × {t.calc.formatDays(dates.days)}
                      </span>
                    </span>
                  ) : (
                    <span className="text-right font-text text-sm text-charcoal/55">{t.cart.needDates}</span>
                  )}
                </div>

                <a
                  href={ready ? telegramLink(buildOrderMessage(t, lines, dates, comment)) : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={!ready}
                  className={cn(
                    "mt-4 flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 font-display text-lg transition-colors",
                    ready ? "bg-charcoal text-cream hover:bg-[#26a5e4]" : "pointer-events-none bg-charcoal/15 text-charcoal/40",
                  )}
                >
                  <TelegramIcon className="size-5" />
                  {t.cart.send}
                </a>
                <p className="mt-2 text-center font-text text-xs text-charcoal/50">{t.cart.sendHint}</p>
              </div>
            </>
          )}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function QtyStepper({
  qty,
  onChange,
  labels,
  className,
}: {
  qty: number;
  onChange: (qty: number) => void;
  labels: { decrease: string; increase: string };
  className?: string;
}) {
  return (
    <div className={cn("flex w-max items-center rounded-full border border-charcoal/20", className)}>
      <button
        type="button"
        aria-label={labels.decrease}
        onClick={() => onChange(qty - 1)}
        className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-charcoal/5"
      >
        <Minus className="size-4" />
      </button>
      <span className="min-w-6 text-center font-display tabular-nums">{qty}</span>
      <button
        type="button"
        aria-label={labels.increase}
        onClick={() => onChange(qty + 1)}
        className="flex size-8 items-center justify-center rounded-full transition-colors hover:bg-charcoal/5"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
