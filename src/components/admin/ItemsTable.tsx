"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatCents } from "@/lib/money";
import ItemRowActions from "@/components/admin/ItemRowActions";

export type AdminItemRow = {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  active: boolean;
  imageUrl: string | null;
  updatedAt: string | Date;
};

export default function ItemsTable({ items }: { items: AdminItemRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) => item.name.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <div>
      <div className="mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search items by name or slug…"
          className="w-full max-w-sm bg-bg-2 border border-line-strong rounded-[10px] px-4 py-2.5 text-[0.88rem]"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted">No items match “{query}”.</p>
      ) : (
        <div className="overflow-x-auto border border-line rounded-2xl">
          <table className="w-full text-left text-[0.88rem]">
            <thead>
              <tr className="border-b border-line text-muted text-[0.78rem] uppercase tracking-[0.08em]">
                <th className="px-4 py-3 font-semibold">Item</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Updated</th>
                <th className="px-4 py-3 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.imageUrl}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover border border-line shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg border border-line bg-gradient-to-br from-[#1c2130] to-[#0f121b] shrink-0" />
                      )}
                      <div>
                        <Link
                          href={`/admin/items/${item.id}/edit`}
                          className="font-medium hover:text-accent transition-colors"
                        >
                          {item.name}
                        </Link>
                        <div className="text-muted text-[0.78rem] font-mono">{item.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatCents(item.priceCents)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        item.active
                          ? "text-[0.76rem] font-semibold text-success border border-success/30 bg-success/10 rounded-full px-2.5 py-0.5"
                          : "text-[0.76rem] font-semibold text-muted border border-line-strong bg-white/[0.02] rounded-full px-2.5 py-0.5"
                      }
                    >
                      {item.active ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/admin/items/${item.id}/edit`}
                        className="text-accent hover:underline text-[0.82rem]"
                      >
                        Edit
                      </Link>
                      <ItemRowActions id={item.id} active={item.active} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
