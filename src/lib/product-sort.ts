import { readStrengths } from "./product-options";
import { applyDiscount } from "./money";

export const sortOptions = [
  ["newest", "Newest first"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
  ["name-asc", "Name: A–Z"],
  ["name-desc", "Name: Z–A"],
] as const;

export function normalizeSort(value?: string | string[]) {
  const sort = Array.isArray(value) ? value[0] : value;
  return sortOptions.some(([key]) => key === sort) ? sort! : "newest";
}

export function sortProducts<T extends { id: string; name: string; priceCents: number; strengths?: unknown; createdAt: Date }>(items: T[], sort: string, percent = 0): T[] {
  const price = (item: T) => {
    const options = readStrengths(item.strengths);
    return applyDiscount(options.length ? Math.min(...options.map(o => o.priceCents)) : item.priceCents, percent);
  };
  return [...items].sort((a, b) => {
    let result = 0;
    if (sort === "price-asc") result = price(a) - price(b);
    else if (sort === "price-desc") result = price(b) - price(a);
    else if (sort === "name-asc") result = a.name.localeCompare(b.name);
    else if (sort === "name-desc") result = b.name.localeCompare(a.name);
    else result = b.createdAt.getTime() - a.createdAt.getTime();
    return result || a.name.localeCompare(b.name) || a.id.localeCompare(b.id);
  });
}
