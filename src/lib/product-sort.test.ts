import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeSort, sortProducts } from "./product-sort";

const items = [
  { id: "a", name: "Alpha", priceCents: 9000, strengths: [{ label: "5 mg", priceCents: 1000 }], createdAt: new Date("2026-10-01") },
  { id: "b", name: "Beta", priceCents: 2000, strengths: [], createdAt: new Date("2026-11-01") },
  { id: "c", name: "Gamma", priceCents: 500, strengths: [{ label: "10 mg", priceCents: 3000 }, { label: "5 mg", priceCents: 1500 }], createdAt: new Date("2026-10-15") },
];

test("price sorting uses the displayed cheapest strength rather than the base price", () => {
  assert.deepEqual(sortProducts(items, "price-asc", 10).map(i => i.id), ["a", "c", "b"]);
  assert.deepEqual(sortProducts(items, "price-desc", 10).map(i => i.id), ["b", "c", "a"]);
  assert.deepEqual(items.map(i => i.id), ["a", "b", "c"]);
});

test("newest and alphabetical sorting, including invalid URL choices", () => {
  assert.deepEqual(sortProducts(items, "newest").map(i => i.id), ["b", "c", "a"]);
  assert.deepEqual(sortProducts(items, "name-asc").map(i => i.id), ["a", "b", "c"]);
  assert.deepEqual(sortProducts(items, "name-desc").map(i => i.id), ["c", "b", "a"]);
  assert.equal(normalizeSort(["price-desc", "bad"]), "price-desc");
  assert.equal(normalizeSort("bad"), "newest");
});
