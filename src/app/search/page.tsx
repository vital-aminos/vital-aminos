import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getDiscount } from "@/lib/settings";
import { GUEST_GLIMPSE, PAGE_WRAP } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import CatalogLock from "@/components/CatalogLock";
import SearchBar from "@/components/SearchBar";

export const metadata: Metadata = { title: "Search — Vital Aminos" };
export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q: rawQ } = await searchParams;
  const q = (Array.isArray(rawQ) ? rawQ[0] : rawQ)?.trim().slice(0, 100) ?? "";

  const [session, discount, items] = await Promise.all([
    auth(),
    getDiscount(),
    q
      ? prisma.item.findMany({
          where: {
            active: true,
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { note: { contains: q, mode: "insensitive" } },
              { batchNumber: { contains: q, mode: "insensitive" } },
            ],
          },
          orderBy: { name: "asc" },
          take: 60,
        })
      : Promise.resolve([]),
  ]);

  const isSignedIn = !!session?.user;
  const visible = isSignedIn ? items : items.slice(0, GUEST_GLIMPSE);

  return (
    <div className={`${PAGE_WRAP} py-14 md:py-20`}>
      <h1 className="text-[clamp(1.9rem,4vw,2.6rem)] mb-6">Search</h1>
      <SearchBar defaultValue={q} className="max-w-[520px] mb-10" autoFocus={!q} />

      {!q ? (
        <p className="text-muted">Search by compound name, description, or batch number.</p>
      ) : items.length === 0 ? (
        <p className="text-muted">No compounds match “{q}”.</p>
      ) : (
        <>
          <p className="text-muted text-[0.9rem] mb-6">
            {items.length} result{items.length === 1 ? "" : "s"} for “{q}”
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((item) => (
              <ProductCard key={item.id} item={item} isSignedIn={isSignedIn} discountPercent={discount.percent} />
            ))}
          </div>
          {!isSignedIn && visible.length < items.length && (
            <CatalogLock
              lockedCount={items.length - visible.length}
              callbackUrl={`/search?q=${encodeURIComponent(q)}`}
            />
          )}
        </>
      )}
    </div>
  );
}
