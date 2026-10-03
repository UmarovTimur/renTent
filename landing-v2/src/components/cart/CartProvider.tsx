"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export interface CartItem {
  /** CatalogProduct id: the same in every language */
  id: string;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  /** total pieces, for the cart button's badge */
  count: number;
  qtyOf: (id: string) => number;
  add: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// The cart is a per-visitor convenience: kept in this browser only, and the
// page works the same without it (private mode, blocked storage).
const STORAGE_KEY = "rentent-cart";

function load(): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (i): i is CartItem => typeof i?.id === "string" && Number.isInteger(i?.qty) && i.qty > 0,
    );
  } catch {
    return [];
  }
}

function save(items: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage unavailable: the cart just won't survive a reload
  }
}

/** Rental cart shared by the home and product pages; the drawer reads `open`. */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  // Read after mount, so the server render and the first client render match
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from browser storage
    setItems(load());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) save(items);
  }, [items, loaded]);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((list) => {
      if (qty <= 0) return list.filter((i) => i.id !== id);
      return list.some((i) => i.id === id)
        ? list.map((i) => (i.id === id ? { ...i, qty } : i))
        : [...list, { id, qty }];
    });
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const qtyOf = (id: string) => items.find((i) => i.id === id)?.qty ?? 0;
    return {
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      qtyOf,
      add: (id) => setQty(id, qtyOf(id) + 1),
      setQty,
      clear: () => setItems([]),
      open,
      setOpen,
    };
  }, [items, open, setQty]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart outside CartProvider");
  return cart;
}
