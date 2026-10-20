"use client";

import { useState } from "react";
import Price from "@/components/Price";
import AddToCartButton from "@/components/AddToCartButton";
import { cartKey, type StrengthOption } from "@/lib/product-options";

export default function ProductPurchase({ itemId, priceCents, strengths, discountPercent, active }: {
  itemId: string; priceCents: number; strengths: StrengthOption[]; discountPercent: number; active: boolean;
}) {
  const [selected, setSelected] = useState(strengths[0]?.label ?? "");
  const option = strengths.find(o => o.label === selected);
  return (
    <div className="flex flex-col items-start gap-5">
      {strengths.length > 0 && (
        <label className="flex flex-col gap-2 w-full max-w-xs text-sm text-muted">
          Dosage / strength
          <select value={selected} onChange={e => setSelected(e.target.value)} className="bg-bg-2 text-text border border-line-strong rounded-lg px-4 py-3">
            {strengths.map(o => <option key={o.label} value={o.label}>{o.label}</option>)}
          </select>
        </label>
      )}
      <Price cents={option?.priceCents ?? priceCents} percent={discountPercent} className="text-accent text-[1.3rem] font-semibold" />
      {active ? <AddToCartButton key={selected} itemId={cartKey(itemId, option?.label)} isSignedIn className="inline-flex items-center justify-center px-7 py-3.5 rounded-full font-semibold bg-gradient-to-br from-accent to-accent-2 text-accent-ink" /> : <p className="text-muted text-sm">This product is currently unavailable.</p>}
    </div>
  );
}
