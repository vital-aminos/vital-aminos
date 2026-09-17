"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { dollarsToCents } from "@/lib/money";

const itemSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  description: z.string().trim().min(1, "Description is required").max(4000),
  note: z.string().trim().max(200).optional().or(z.literal("")),
  price: z.string().refine((v) => {
    const cents = dollarsToCents(v);
    return Number.isFinite(cents) && cents >= 0;
  }, "Enter a valid non-negative price"),
  imageUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  active: z.coerce.boolean().optional(),
});

export type ItemFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function parseForm(formData: FormData) {
  const raw = {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    note: String(formData.get("note") ?? ""),
    price: String(formData.get("price") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? ""),
    active: formData.get("active") === "on",
  };
  return itemSchema.safeParse(raw);
}

export async function createItem(
  _prev: ItemFormState,
  formData: FormData
): Promise<ItemFormState> {
  await requireAdmin();

  const parsed = parseForm(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  const data = parsed.data;
  const existing = await prisma.item.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return { fieldErrors: { slug: "That slug is already in use." } };
  }

  await prisma.item.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      note: data.note || null,
      priceCents: dollarsToCents(data.price),
      imageUrl: data.imageUrl || null,
      active: data.active ?? true,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect_to_admin();
}

export async function updateItem(
  id: string,
  _prev: ItemFormState,
  formData: FormData
): Promise<ItemFormState> {
  await requireAdmin();

  const parsed = parseForm(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  const data = parsed.data;
  const existing = await prisma.item.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== id) {
    return { fieldErrors: { slug: "That slug is already in use." } };
  }

  await prisma.item.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      note: data.note || null,
      priceCents: dollarsToCents(data.price),
      imageUrl: data.imageUrl || null,
      active: data.active ?? false,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/item/${data.slug}`);
  redirect_to_admin();
}

export async function deleteItem(id: string) {
  await requireAdmin();
  await prisma.item.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function toggleItemActive(id: string, active: boolean) {
  await requireAdmin();
  await prisma.item.update({ where: { id }, data: { active } });
  revalidatePath("/");
  revalidatePath("/admin");
}

function redirect_to_admin(): never {
  redirect("/admin");
}
