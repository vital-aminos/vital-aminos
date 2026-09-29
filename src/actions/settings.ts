"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

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
