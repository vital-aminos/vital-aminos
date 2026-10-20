import assert from "node:assert/strict";
import { test } from "node:test";
import { cartEntries, cartKey, resolveStrength, strengthsSchema } from "./product-options";
import { applyDiscount } from "./money";

const strengths = [{ label: "5 mg", priceCents: 3000 }, { label: "10 mg", priceCents: 5500 }];

test("strength prices override the base price and receive the site discount", () => {
  const selected = resolveStrength(strengths, 9999, "10 mg");
  assert.deepEqual(selected, { strength: "10 mg", priceCents: 5500 });
  assert.equal(applyDiscount(selected!.priceCents, 10) * 2, 9900);
});

test("existing products retain base pricing; missing and removed options are rejected", () => {
  assert.deepEqual(resolveStrength([], 4200), { strength: null, priceCents: 4200 });
  assert.equal(resolveStrength(strengths, 4200), null);
  assert.equal(resolveStrength(strengths, 4200, "20 mg"), null);
  assert.equal(resolveStrength([], 4200, "5 mg"), null);
});

test("different strengths remain separate and labels round-trip through cart storage", () => {
  const label = "10 mg / 2 mL :: α 50%";
  const cart = { [cartKey("product", "5 mg")]: 1, [cartKey("product", label)]: 2, legacy: 3 };
  assert.deepEqual(cartEntries(cart), [
    { itemId: "product", quantity: 1, strength: "5 mg" },
    { itemId: "product", quantity: 2, strength: label },
    { itemId: "legacy", quantity: 3, strength: undefined },
  ]);
});

test("admin option validation rejects duplicates and invalid prices", () => {
  assert.equal(strengthsSchema.safeParse(strengths).success, true);
  for (const options of [
    [{ label: "5 mg", priceCents: 1 }, { label: " 5 MG ", priceCents: 2 }],
    [{ label: "", priceCents: 100 }],
    [{ label: "5 mg", priceCents: -1 }],
    [{ label: "5 mg", priceCents: 1.5 }],
    [{ label: "5 mg", priceCents: null }],
  ]) assert.equal(strengthsSchema.safeParse(options).success, false);
});
