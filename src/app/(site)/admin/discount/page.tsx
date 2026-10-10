import { prisma } from "@/lib/prisma";
import DiscountForm from "@/components/admin/DiscountForm";

export default async function AdminDiscountPage() {
  const s = await prisma.siteSettings.findUnique({ where: { id: "main" } });
  return (
    <div>
      <h1 className="text-[1.6rem] mb-1">Sitewide discount</h1>
      <p className="text-muted text-[0.9rem] mb-8">
        When on, every product shows its original price struck through next to the discounted
        price, and orders are charged at the discounted price.
      </p>
      <DiscountForm enabled={s?.discountEnabled ?? false} percent={s?.discountPercent ?? 10} />
    </div>
  );
}
