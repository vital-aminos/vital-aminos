"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/admin";

export type CartLine = { itemId: string; quantity: number };

/** Re-fetches current item data server-side for a set of cart lines (for display + safe pricing). */
export async function getCartDetails(lines: CartLine[]) {
  if (lines.length === 0) return { lines: [], totalCents: 0 };

  const ids = lines.map((l) => l.itemId);
  const items = await prisma.item.findMany({ where: { id: { in: ids } } });
  const byId = new Map(items.map((i) => [i.id, i]));

  const detailed = lines
    .map((line) => {
      const item = byId.get(line.itemId);
      if (!item || !item.active) return null;
      const quantity = Math.max(1, Math.min(99, Math.floor(line.quantity)));
      return {
        itemId: item.id,
        slug: item.slug,
        name: item.name,
        imageUrl: item.imageUrl,
        priceCents: item.priceCents,
        quantity,
        lineTotalCents: item.priceCents * quantity,
      };
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);

  const totalCents = detailed.reduce((sum, l) => sum + l.lineTotalCents, 0);
  return { lines: detailed, totalCents };
}

export type PlaceOrderResult = { orderId: string } | { error: string };

/** Creates a pending order priced from live DB data. No payment is collected yet. */
export async function placeOrder(lines: CartLine[]): Promise<PlaceOrderResult> {
  const user = await requireUser();

  const { lines: detailed, totalCents } = await getCartDetails(lines);
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
