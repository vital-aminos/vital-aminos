import { prisma } from "@/lib/prisma";

export type Discount = { enabled: boolean; percent: number };

/** Active sitewide discount. Falls back to "off" if the row/table doesn't exist yet. */
export async function getDiscount(): Promise<Discount> {
  try {
    const s = await prisma.siteSettings.findUnique({ where: { id: "main" } });
    if (!s || !s.discountEnabled || s.discountPercent <= 0) return { enabled: false, percent: 0 };
    return { enabled: true, percent: Math.min(90, s.discountPercent) };
  } catch {
    return { enabled: false, percent: 0 };
  }
}

export function applyDiscount(cents: number, percent: number): number {
  if (percent <= 0) return cents;
  return Math.round((cents * (100 - percent)) / 100);
}
