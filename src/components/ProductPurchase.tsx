"use client";

import { useState } from "react";
import Price from "@/components/Price";
import AddToCartButton from "@/components/AddToCartButton";
import CartQuantity from "@/components/CartQuantity";
import { cartKey, type StrengthOption } from "@/lib/product-options";

export default function ProductPurchase({ itemId, name, priceCents, strengths, discountPercent, active, outOfStock }: {
  itemId: string; name: string; priceCents: number; strengths: StrengthOption[]; discountPercent: number; active: boolean; outOfStock: boolean;
}) {
  const [selected, setSelected] = useState(strengths[0]?.label ?? "");
  const [quantity, setQuantity] = useState(1);
  const option = strengths.find(o => o.label === selected);
  return (
    <div className="flex flex-col items-start gap-5">
      {strengths.length > 0 && (
        <label className="flex flex-col gap-2 w-full max-w-xs text-sm text-muted">
          Compound Content
          <select value={selected} onChange={e => setSelected(e.target.value)} className="bg-bg-2 text-text border border-line-strong rounded-lg px-4 py-3">
            {strengths.map(o => <option key={o.label} value={o.label}>{o.label}</option>)}
          </select>
        </label>
      )}
      <Price cents={option?.priceCents ?? priceCents} percent={discountPercent} className="text-accent text-[1.3rem] font-semibold" />
      {outOfStock ? <p className="text-danger font-semibold" role="status">Out of stock</p> : active ? (
        <div className="flex flex-wrap items-center gap-4">
          <CartQuantity key={quantity} quantity={quantity} name={name} onChange={setQuantity} />
          <AddToCartButton key={`${selected}:${quantity}`} itemId={cartKey(itemId, option?.label)} quantity={quantity} isSignedIn className="inline-flex items-center justify-center px-7 py-3.5 rounded-full font-semibold bg-gradient-to-br from-accent to-accent-2 text-accent-ink" />
        </div>
      ) : <p className="text-muted text-sm">This product is currently unavailable.</p>}
    </div>
  );
}
