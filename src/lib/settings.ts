import { prisma } from "@/lib/prisma";
import { DEFAULT_BANNER_TEXT } from "@/lib/banner";

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

/** Text shown in the top banner. Empty string means the admin hid it. */
export async function getBannerText(): Promise<string> {
  try {
    const s = await prisma.siteSettings.findUnique({ where: { id: "main" } });
    return s ? s.bannerText : DEFAULT_BANNER_TEXT;
  } catch {
    return DEFAULT_BANNER_TEXT;
  }
}
