"use server";

import { z } from "zod";
import { cartKey, resolveStrength } from "@/lib/product-options";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/admin";
import { getDiscount } from "@/lib/settings";
import { applyDiscount } from "@/lib/money";

const cartSchema = z.array(z.object({
  itemId: z.string().min(1).max(120),
  quantity: z.number().int().min(1).max(99),
  strength: z.string().min(1).max(80).optional(),
})).max(100).refine(lines => new Set(lines.map(l => cartKey(l.itemId, l.strength))).size === lines.length, "Duplicate cart lines");
export type CartLine = z.infer<typeof cartSchema>[number];

/** Re-fetches current item data server-side for a set of cart lines (for display + safe pricing). */
export async function getCartDetails(lines: CartLine[]) {
  await requireUser();
  lines = cartSchema.parse(lines);
  if (lines.length === 0) return { lines: [], totalCents: 0, unavailable: [] };

  const discount = await getDiscount();
  const ids = lines.map((l) => l.itemId);
  const items = await prisma.item.findMany({ where: { id: { in: ids } } });
  const byId = new Map(items.map((i) => [i.id, i]));

  const detailed = lines
    .map((line) => {
      const item = byId.get(line.itemId);
      if (!item || !item.active || item.outOfStock) return null;
      // Never silently substitute a different strength for one already in the cart.
      const option = resolveStrength(item.strengths, item.priceCents, line.strength);
      if (!option) return null;
      const price = option.priceCents;
      const quantity = line.quantity;
      return {
        itemId: item.id,
        cartKey: cartKey(item.id, option.strength),
        strength: option.strength,
        slug: item.slug,
        name: item.name,
        imageUrl: item.imageUrl,
        originalPriceCents: price,
        priceCents: applyDiscount(price, discount.percent),
        discountPercent: discount.percent,
        quantity,
        lineTotalCents: applyDiscount(price, discount.percent) * quantity,
      };
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);

  const totalCents = detailed.reduce((sum, l) => sum + l.lineTotalCents, 0);
  const availableKeys = new Set(detailed.map(l => l.cartKey));
  const unavailable = lines.filter(l => !availableKeys.has(cartKey(l.itemId, l.strength))).map(l => ({
    cartKey: cartKey(l.itemId, l.strength),
    name: byId.get(l.itemId)?.name ?? "Unavailable product",
    strength: l.strength,
    reason: byId.get(l.itemId)?.outOfStock ? "Out of stock" : "No longer available",
  }));
  return { lines: detailed, totalCents, unavailable };
}

export type PlaceOrderResult = { orderId: string } | { error: string };

/** Creates a pending order priced from live DB data. No payment is collected yet. */
export async function placeOrder(lines: CartLine[]): Promise<PlaceOrderResult> {
  const user = await requireUser();

  if (!cartSchema.safeParse(lines).success) return { error: "Your cart contains invalid quantities or options. Please update it and try again." };
  const { lines: detailed, totalCents } = await getCartDetails(lines);
  if (detailed.length !== lines.length) return { error: "Some products or strengths are no longer available. Please review your cart." };
  if (detailed.length === 0) {
    return { error: "Your cart is empty or those items are no longer available." };
  }

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      totalCents,
      items: {
        create: detailed.map((l) => ({
          itemId: l.itemId,
          strength: l.strength,
          quantity: l.quantity,
          priceCents: l.priceCents,
        })),
      },
    },
  });

  return { orderId: order.id };
}

export async function getMyOrders() {
  const user = await requireUser();
  return prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { item: true } } },
  });
}
