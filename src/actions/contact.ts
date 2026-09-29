"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  message: z.string().trim().min(10, "Please write at least 10 characters").max(4000),
});

export type ContactState = { fieldErrors?: Record<string, string>; sent?: boolean; error?: string };

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real users never fill this hidden field.
  if (String(formData.get("website") ?? "") !== "") return { sent: true };

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] = i.message;
    return { fieldErrors };
  }
  try {
    await prisma.contactMessage.create({ data: parsed.data });
  } catch {
    return { error: "Couldn't send your message right now. Please try again shortly." };
  }
  revalidatePath("/admin/messages");
  return { sent: true };
}

export async function markMessageRead(id: string, read: boolean) {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { read } });
  revalidatePath("/admin/messages");
}
