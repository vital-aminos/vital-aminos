"use client";

import { useState } from "react";

export default function CartQuantity({ quantity, name, disabled, onChange }: {
  quantity: number; name: string; disabled?: boolean; onChange: (quantity: number) => void;
}) {
  const [draft, setDraft] = useState(String(quantity));
  function commit() {
    const number = Number(draft);
    const next = draft.trim() && Number.isFinite(number) ? Math.max(1, Math.min(99, Math.floor(number))) : quantity;
    setDraft(String(next));
    if (next !== quantity) onChange(next);
  }
  return (
    <div className="flex items-center border border-line-strong rounded-lg shrink-0">
      <button type="button" aria-label={`Decrease quantity for ${name}`} disabled={disabled || quantity <= 1} onClick={() => onChange(quantity - 1)} className="px-3 py-2 disabled:opacity-30">−</button>
      <input aria-label={`Quantity for ${name}`} type="number" min={1} max={99} step={1} disabled={disabled} value={draft} onChange={e => setDraft(e.target.value)} onBlur={commit} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); e.currentTarget.blur(); } }} className="w-12 bg-bg-2 py-2 text-center" />
      <button type="button" aria-label={`Increase quantity for ${name}`} disabled={disabled || quantity >= 99} onClick={() => onChange(quantity + 1)} className="px-3 py-2 disabled:opacity-30">+</button>
    </div>
  );
}
