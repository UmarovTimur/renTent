"use client";

import { Check, Plus } from "lucide-react";
import { ArrowButton } from "@/components/ArrowButton";
import { useCart } from "@/components/cart/CartProvider";
import { QtyStepper } from "@/components/cart/CartDrawer";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";
import type { CatalogProduct } from "@/data/products";

/** Product page: "Add to cart", then a quantity stepper and "Check out". */
export function AddToCart({ product }: { product: CatalogProduct }) {
  const t = useI18n().t.cart;
  const cart = useCart();
  const qty = cart.qtyOf(product.id);

  if (qty === 0) {
    return (
      <ArrowButton onClick={() => cart.add(product.id)} variant="dark">
        {t.add}
      </ArrowButton>
    );
  }
  return (
    <div className="flex items-center gap-3">
      <QtyStepper
        qty={qty}
        onChange={(n) => cart.setQty(product.id, n)}
        labels={{ decrease: t.decrease, increase: t.increase }}
        className="h-[3.4rem] px-2 [&_button]:size-10"
      />
      <ArrowButton onClick={() => cart.setOpen(true)} variant="dark">
        {t.checkout}
      </ArrowButton>
    </div>
  );
}

/** Catalog card: a round "+" on the photo; shows the count once added. */
export function AddToCartBadge({ product, className }: { product: CatalogProduct; className?: string }) {
  const t = useI18n().t.cart;
  const cart = useCart();
  const qty = cart.qtyOf(product.id);

  return (
    <button
      type="button"
      aria-label={qty > 0 ? `${t.addTo(product.name)}. ${t.inCart(qty)}` : t.addTo(product.name)}
      onClick={(e) => {
        e.stopPropagation();
        cart.add(product.id);
      }}
      className={cn(
        "flex h-10 min-w-10 items-center justify-center gap-1 rounded-full px-2.5 font-display text-sm font-semibold tabular-nums shadow-sm transition-colors duration-200",
        qty > 0 ? "bg-charcoal text-cream" : "bg-cream/90 text-charcoal hover:bg-charcoal hover:text-cream",
        className,
      )}
    >
      {qty > 0 ? (
        <>
          <Check className="size-4" strokeWidth={2.5} />
          {qty}
        </>
      ) : (
        <Plus className="size-5" strokeWidth={2.25} />
      )}
    </button>
  );
}
