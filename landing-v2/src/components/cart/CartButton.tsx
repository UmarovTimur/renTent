"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";

/**
 * Cart pill with the number of pieces — bottom right on phones (the section
 * menu takes the bottom centre there), bottom centre on desktop: the same
 * glass pill as the header menus (MorphMenu's closed trigger), switching its
 * tint by the `data-header-theme` section beneath it. The label shows from md
 * up; on phones it stays compact next to the docked section menu.
 * Shown only once something is in the cart.
 */
export function CartButton() {
  const t = useI18n().t.cart;
  const { count, setOpen } = useCart();
  const pathname = usePathname();
  const ref = useRef<HTMLButtonElement>(null);
  const [overDark, setOverDark] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const box = ref.current?.getBoundingClientRect();
      if (!box) return;
      const under = document
        .elementsFromPoint(box.left + box.width / 2, box.top + box.height / 2)
        .find((el) => el instanceof HTMLElement && el.dataset.headerTheme) as HTMLElement | undefined;
      setOverDark(under?.dataset.headerTheme === "dark");
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return (
    <button
      ref={ref}
      type="button"
      aria-label={`${t.open} (${count})`}
      onClick={() => setOpen(true)}
      className={cn(
        "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-50 flex items-center gap-2 rounded-full px-3.5 py-2.5 font-display text-base leading-none text-white backdrop-blur-md transition-[transform,opacity,background-color] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] md:bottom-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:backdrop-blur-xl",
        overDark ? "bg-black/25 hover:bg-black/40" : "bg-charcoal/40 hover:bg-charcoal/60",
        count > 0 ? "scale-100 opacity-100" : "pointer-events-none scale-50 opacity-0",
      )}
    >
      <ShoppingBag aria-hidden className="h-4 w-4 opacity-70" />
      <span className="max-md:sr-only">{t.title}</span>
      <span className="tabular-nums">{count}</span>
    </button>
  );
}
