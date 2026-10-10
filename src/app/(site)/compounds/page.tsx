import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getDiscount } from "@/lib/settings";
import { GUEST_GLIMPSE, PAGE_WRAP } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import CatalogLock from "@/components/CatalogLock";

export const metadata: Metadata = { title: "Compounds — Vital Aminos" };
export const dynamic = "force-dynamic";

export default async function CompoundsPage() {
  const [session, items, discount] = await Promise.all([
    auth(),
    prisma.item.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } }),
    getDiscount(),
  ]);
  const isSignedIn = !!session?.user;
  const visible = isSignedIn ? items : items.slice(0, GUEST_GLIMPSE);

  return (
    <div className={`${PAGE_WRAP} py-14 md:py-20`}>
      <div className="max-w-[60ch] mb-11">
        <h1 className="text-[clamp(1.9rem,4vw,2.6rem)] mb-2.5">Research compounds</h1>
        <p className="text-muted">
          Every listing ships with a batch-specific Certificate of Analysis. For research use only.
        </p>
      </div>
      {items.length === 0 ? (
        <p className="text-muted">No products are listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((item) => (
            <ProductCard key={item.id} item={item} isSignedIn={isSignedIn} discountPercent={discount.percent} />
          ))}
        </div>
      )}
      {!isSignedIn && items.length > 0 && (
        <CatalogLock lockedCount={items.length - visible.length} callbackUrl="/compounds" />
      )}
    </div>
  );
}
