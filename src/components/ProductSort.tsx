"use client";

import { sortOptions } from "@/lib/product-sort";

export default function ProductSort({ sort, query }: { sort: string; query?: string }) {
  return (
    <form method="get" className="flex items-center gap-3 mb-7 flex-wrap">
      {query !== undefined && <input type="hidden" name="q" value={query} />}
      <label htmlFor="product-sort" className="text-sm text-muted">Sort by</label>
      <select id="product-sort" name="sort" defaultValue={sort} onChange={e => e.currentTarget.form?.requestSubmit()} className="bg-bg-2 border border-line-strong rounded-lg px-4 py-2 text-sm">
        {sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
      <noscript><button type="submit">Apply sort</button></noscript>
    </form>
  );
}
