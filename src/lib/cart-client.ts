"use client";

// Client-only cart storage. Cart contents are just {itemId, quantity} pairs —
// real prices are always re-fetched server-side before an order is created.
const CART_KEY = "va_cart";
const CART_EVENT = "va_cart_change";

export type CartMap = Record<string, number>;

export function readCart(): CartMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as CartMap;
  } catch {
    return {};
  }
}

function writeCart(cart: CartMap) {
  try {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent(CART_EVENT));
  } catch {
    /* storage unavailable */
  }
}

export function addToCart(itemId: string, quantity = 1) {
  const cart = readCart();
  cart[itemId] = Math.min(99, (cart[itemId] ?? 0) + quantity);
  writeCart(cart);
}

export function setCartQuantity(itemId: string, quantity: number) {
  const cart = readCart();
  if (quantity <= 0) {
    delete cart[itemId];
  } else {
    cart[itemId] = Math.min(99, Math.floor(quantity));
  }
  writeCart(cart);
}

export function removeFromCart(itemId: string) {
  const cart = readCart();
  delete cart[itemId];
  writeCart(cart);
}

export function clearCart() {
  writeCart({});
}

export function cartCount(cart: CartMap): number {
  return Object.values(cart).reduce((sum, q) => sum + q, 0);
}

export function onCartChange(cb: () => void): () => void {
  window.addEventListener(CART_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CART_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}
