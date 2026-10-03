"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * Round cart button in the bottom-right corner, with the number of pieces.
 * Shown only once something is in the cart.
 */
export function CartButton() {
  const t = useI18n().t.cart;
  const { count, setOpen } = useCart();

  return (
    <button
      type="button"
      aria-label={`${t.open} (${count})`}
      onClick={() => setOpen(true)}
      className={cn(
        "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50 flex size-14 items-center justify-center rounded-full bg-charcoal text-cream shadow-[0_12px_30px_-10px_rgba(42,41,40,0.6)] transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:scale-105 md:bottom-6 md:right-6 md:size-16",
        count > 0 ? "scale-100 opacity-100" : "pointer-events-none scale-50 opacity-0",
      )}
    >
      <ShoppingBag className="size-6" />
      <span className="absolute -right-0.5 -top-0.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-cream px-1.5 font-display text-sm font-semibold tabular-nums text-charcoal ring-2 ring-charcoal">
        {count}
      </span>
    </button>
  );
}
