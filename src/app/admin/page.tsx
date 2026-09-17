import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ItemsTable from "@/components/admin/ItemsTable";

export default async function AdminItemsPage() {
  const [items, visibleCount, pendingOrderCount] = await Promise.all([
    prisma.item.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.item.count({ where: { active: true } }),
    prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
  ]);

  const stats = [
    { label: "Total items", value: items.length },
    { label: "Visible in shop", value: visibleCount },
    { label: "Hidden", value: items.length - visibleCount },
    { label: "Orders awaiting payment", value: pendingOrderCount },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[1.6rem]">Dashboard</h1>
          <p className="text-muted text-[0.9rem]">Manage what&apos;s live on the site.</p>
        </div>
        <Link
          href="/admin/items/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-[0.88rem] bg-gradient-to-br from-accent to-accent-2 text-accent-ink"
        >
          + Add product
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-panel border border-line rounded-2xl p-4">
            <div className="text-[1.6rem] font-serif">{s.value}</div>
            <div className="text-muted text-[0.78rem]">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-[1.1rem] mb-4">Products</h2>

      {items.length === 0 ? (
        <p className="text-muted">No items yet — create your first one.</p>
      ) : (
        <ItemsTable items={items} />
      )}
    </div>
  );
}
