"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { BANNER_MAX_LENGTH } from "@/lib/banner";

const schema = z.object({
  enabled: z.boolean(),
  percent: z.coerce.number().int().min(1, "Enter 1–90").max(90, "Enter 1–90"),
});

export type DiscountFormState = { error?: string; saved?: boolean };

export async function saveDiscount(
  _prev: DiscountFormState,
  formData: FormData
): Promise<DiscountFormState> {
  await requireAdmin();
  const parsed = schema.safeParse({
    enabled: formData.get("enabled") === "on",
    percent: formData.get("percent"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: { discountEnabled: parsed.data.enabled, discountPercent: parsed.data.percent },
    create: { id: "main", discountEnabled: parsed.data.enabled, discountPercent: parsed.data.percent },
  });
  revalidatePath("/", "layout");
  return { saved: true };
}

const bannerSchema = z.object({
  text: z.string().trim().max(BANNER_MAX_LENGTH, `Keep it under ${BANNER_MAX_LENGTH} characters`),
});

export type BannerFormState = { error?: string; saved?: boolean };

/** Saves the top-banner text. An empty value hides the banner text. */
export async function saveBanner(
  _prev: BannerFormState,
  formData: FormData
): Promise<BannerFormState> {
  await requireAdmin();
  const parsed = bannerSchema.safeParse({ text: String(formData.get("text") ?? "") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  await prisma.siteSettings.upsert({
    where: { id: "main" },
    update: { bannerText: parsed.data.text },
    create: { id: "main", bannerText: parsed.data.text },
  });
  revalidatePath("/", "layout");
  return { saved: true };
}
