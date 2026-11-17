import { z } from "zod";

export const strengthsSchema = z.array(z.object({
  label: z.string().trim().min(1, "Enter a compound content label").max(80),
  priceCents: z.number().int().min(0).max(2147483647),
})).max(30).refine(
  (options) => new Set(options.map((o) => o.label.toLowerCase())).size === options.length,
  "Compound content labels must be unique",
);

export type StrengthOption = z.infer<typeof strengthsSchema>[number];

export function readStrengths(value: unknown): StrengthOption[] {
  const parsed = strengthsSchema.safeParse(value);
  return parsed.success ? parsed.data : [];
}

/** Null means the requested option is stale or a required selection is missing. */
export function resolveStrength(value: unknown, basePriceCents: number, label?: string) {
  const options = readStrengths(value);
  const option = options.find(o => o.label === label);
  if ((options.length > 0 || label) && !option) return null;
  return { strength: option?.label ?? null, priceCents: option?.priceCents ?? basePriceCents };
}

export function cartKey(itemId: string, strength?: string | null) {
  return strength ? `${itemId}::${encodeURIComponent(strength)}` : itemId;
}

export function cartEntries(cart: Record<string, number>) {
  return Object.entries(cart).map(([key, quantity]) => {
    const [itemId, encoded] = key.split("::");
    let strength: string | undefined;
    try { strength = encoded ? decodeURIComponent(encoded) : undefined; } catch { strength = encoded; }
    return { itemId, quantity, strength };
  });
}
