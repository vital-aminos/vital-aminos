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
  batchNumber: z.string().trim().max(60).optional().or(z.literal("")),
  purity: z.string().trim().max(30).optional().or(z.literal("")),
  coaUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  active: z.coerce.boolean().optional(),
});

export type ItemFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

function parseForm(formData: FormData) {
  const raw = {
    name: String(formData.get("name") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    note: String(formData.get("note") ?? ""),
    price: String(formData.get("price") ?? ""),
    batchNumber: String(formData.get("batchNumber") ?? ""),
    purity: String(formData.get("purity") ?? ""),
    coaUrl: String(formData.get("coaUrl") ?? ""),
    active: formData.get("active") === "on",
  };
  return itemSchema.safeParse(raw);
}

// An empty file input is sent as a zero-byte File — treat that as "no upload".
function readImageUpload(formData: FormData): { file: File | null; error: string | null } {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return { file: null, error: null };
  if (!IMAGE_TYPES.includes(file.type)) {
    return { file: null, error: "Photo must be a PNG, JPEG or WebP image." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { file: null, error: "Photo must be 5 MB or smaller." };
  }
  return { file, error: null };
}

// Stores the photo bytes in the database and returns the public URL to save on the Item.
async function saveImage(itemId: string, file: File): Promise<string> {
  const data = Buffer.from(await file.arrayBuffer());
  const saved = await prisma.itemImage.upsert({
    where: { itemId },
    create: { itemId, data, mimeType: file.type },
    update: { data, mimeType: file.type },
  });
  // ?v= busts the browser cache when the photo is replaced.
  return `/api/item-image/${itemId}?v=${saved.updatedAt.getTime()}`;
}

function zodFieldErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    fieldErrors[String(issue.path[0])] = issue.message;
  }
  return fieldErrors;
}

export async function createItem(
  _prev: ItemFormState,
  formData: FormData
): Promise<ItemFormState> {
  await requireAdmin();

  const parsed = parseForm(formData);
  if (!parsed.success) return { fieldErrors: zodFieldErrors(parsed.error) };

  const upload = readImageUpload(formData);
  if (upload.error) return { fieldErrors: { image: upload.error } };

  const data = parsed.data;
  const existing = await prisma.item.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return { fieldErrors: { slug: "That slug is already in use." } };
  }

  const created = await prisma.item.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      note: data.note || null,
      priceCents: dollarsToCents(data.price),
      batchNumber: data.batchNumber || null,
      purity: data.purity || null,
      coaUrl: data.coaUrl || null,
      active: data.active ?? true,
    },
  });

  if (upload.file) {
    const imageUrl = await saveImage(created.id, upload.file);
    await prisma.item.update({ where: { id: created.id }, data: { imageUrl } });
  }

  revalidatePath("/", "layout");
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
  if (!parsed.success) return { fieldErrors: zodFieldErrors(parsed.error) };

  const upload = readImageUpload(formData);
  if (upload.error) return { fieldErrors: { image: upload.error } };

  const data = parsed.data;
  const existing = await prisma.item.findUnique({ where: { slug: data.slug } });
  if (existing && existing.id !== id) {
    return { fieldErrors: { slug: "That slug is already in use." } };
  }

  // A new upload replaces the photo, "remove" clears it, otherwise it's left untouched.
  let imageUrl: string | null | undefined;
  if (upload.file) {
    imageUrl = await saveImage(id, upload.file);
  } else if (formData.get("removeImage") === "on") {
    await prisma.itemImage.deleteMany({ where: { itemId: id } });
    imageUrl = null;
  }

  await prisma.item.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      note: data.note || null,
      priceCents: dollarsToCents(data.price),
      ...(imageUrl !== undefined && { imageUrl }),
      batchNumber: data.batchNumber || null,
      purity: data.purity || null,
      coaUrl: data.coaUrl || null,
      active: data.active ?? false,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  revalidatePath(`/item/${data.slug}`);
  redirect_to_admin();
}

export async function deleteItem(id: string) {
  await requireAdmin();
  await prisma.item.delete({ where: { id } });
  revalidatePath("/", "layout");
  revalidatePath("/admin");
}

export async function toggleItemActive(id: string, active: boolean) {
  await requireAdmin();
  await prisma.item.update({ where: { id }, data: { active } });
  revalidatePath("/", "layout");
  revalidatePath("/admin");
}

function redirect_to_admin(): never {
  redirect("/admin");
}
