import assert from "node:assert/strict";
import { test } from "node:test";
import { addToCart, readCart, setCartQuantity } from "./cart-client";
import { cartKey } from "./product-options";

test("quantity updates preserve separate strengths, clamp limits, and ignore non-numbers", () => {
  const storage = new Map<string, string>();
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    localStorage: { getItem: (k: string) => storage.get(k), setItem: (k: string, v: string) => storage.set(k, v) },
    dispatchEvent: () => true,
  } });
  try {
    const small = cartKey("item", "5 mg");
    const large = cartKey("item", "10 mg");
    addToCart(small);
    addToCart(large);
    setCartQuantity(small, 4);
    assert.deepEqual(readCart(), { [small]: 4, [large]: 1 });
    setCartQuantity(small, 1000);
    assert.equal(readCart()[small], 99);
    setCartQuantity(small, NaN);
    assert.equal(readCart()[small], 99);
    setCartQuantity(small, 0);
    assert.deepEqual(readCart(), { [large]: 1 });
  } finally { Reflect.deleteProperty(globalThis, "window"); }
});
