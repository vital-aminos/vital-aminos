"use client";

import { useActionState, useRef, useState } from "react";
import type { ItemFormState } from "@/actions/items";

export type ItemFormValues = {
  category: string;
  strengths: { label: string; priceCents: number }[];
  name: string;
  slug: string;
  description: string;
  note: string;
  price: string; // dollars, e.g. "60.00"
  imageUrl: string;
  batchNumber: string;
  purity: string;
  coaUrl: string;
  active: boolean;
  outOfStock: boolean;
};

export default function ItemForm({
  action,
  initial,
  submitLabel,
}: {
  action: (prevState: ItemFormState, formData: FormData) => Promise<ItemFormState>;
  initial?: Partial<ItemFormValues>;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<ItemFormState, FormData>(action, {});
  const [preview, setPreview] = useState<string | null>(initial?.imageUrl || null);
  const [remove, setRemove] = useState(false);
  const [strengths, setStrengths] = useState(() => (initial?.strengths ?? []).map(o => ({ label: o.label, price: (o.priceCents / 100).toFixed(2) })));
  const fileRef = useRef<HTMLInputElement>(null);

  const fieldError = (name: string) => state.fieldErrors?.[name];

  return (
    <form action={formAction} className="flex flex-col gap-5 max-w-[640px]">
      <Field label="Name" error={fieldError("name")}>
        <input
          name="name"
          defaultValue={initial?.name}
          required
          className="w-full bg-bg-2 border border-line-strong rounded-[10px] px-4 py-3"
        />
      </Field>

      <Field label="Slug (URL)" error={fieldError("slug")} hint="Lowercase letters, numbers, hyphens — e.g. bpc-157-10mg">
        <input
          name="slug"
          defaultValue={initial?.slug}
          required
          className="w-full bg-bg-2 border border-line-strong rounded-[10px] px-4 py-3 font-mono text-[0.9rem]"
        />
      </Field>

      <Field label="Price (USD)" error={fieldError("price")}>
        <input
          name="price"
          type="number"
          min="0"
          step="0.01"
          defaultValue={initial?.price}
          required
          className="w-full bg-bg-2 border border-line-strong rounded-[10px] px-4 py-3"
        />
      </Field>

      <Field label="Category" error={fieldError("category")} hint="Optional — products in the same category appear as similar products.">
        <input name="category" defaultValue={initial?.category} maxLength={80} placeholder="e.g. Research peptides" className="w-full bg-bg-2 border border-line-strong rounded-[10px] px-4 py-3" />
      </Field>

      <fieldset className="border border-line rounded-xl p-4 flex flex-col gap-3">
        <legend className="text-sm text-muted px-2">Compound Content</legend>
        <p className="text-muted text-xs">Optional. Add a label and USD price for each option. Without options, the product uses its standard price.</p>
        <input type="hidden" name="strengths" value={JSON.stringify(strengths.map(o => ({ label: o.label, priceCents: o.price.trim() === "" ? null : Math.round(Number(o.price) * 100) })))} />
        {strengths.map((option, index) => (
          <div key={index} className="flex gap-2 items-end flex-wrap">
            <label className="flex-1 min-w-32 text-xs text-muted">Content
              <input aria-label={`Compound content ${index + 1}`} required maxLength={80} placeholder="e.g. 5 mg" value={option.label} onChange={e => setStrengths(strengths.map((o, i) => i === index ? { ...o, label: e.target.value } : o))} className="block w-full bg-bg-2 border border-line-strong rounded-lg px-3 py-2 mt-1" />
            </label>
            <label className="flex-1 min-w-28 text-xs text-muted">Price (USD)
              <input aria-label={`Compound content ${index + 1} price`} required type="number" min="0" step="0.01" value={option.price} onChange={e => setStrengths(strengths.map((o, i) => i === index ? { ...o, price: e.target.value } : o))} className="block w-full bg-bg-2 border border-line-strong rounded-lg px-3 py-2 mt-1" />
            </label>
            <button type="button" aria-label={`Remove compound content ${index + 1}`} onClick={() => setStrengths(strengths.filter((_, i) => i !== index))} className="px-3 py-2 text-danger text-sm">Remove</button>
          </div>
        ))}
        {fieldError("strengths") && <p role="alert" className="text-danger text-xs">{fieldError("strengths")}</p>}
        <button type="button" disabled={strengths.length >= 30} onClick={() => setStrengths([...strengths, { label: "", price: initial?.price ?? "" }])} className="self-start text-accent text-sm disabled:opacity-50">+ Add compound content</button>
      </fieldset>

      <Field label="Short note" error={fieldError("note")} hint="Optional — shown under the price, e.g. “Single vial • 10 mg”">
        <input
          name="note"
          defaultValue={initial?.note}
          className="w-full bg-bg-2 border border-line-strong rounded-[10px] px-4 py-3"
        />
      </Field>

      <Field label="Description" error={fieldError("description")}>
        <textarea
          name="description"
          defaultValue={initial?.description}
          required
          rows={6}
          className="w-full bg-bg-2 border border-line-strong rounded-[10px] px-4 py-3 resize-y"
        />
      </Field>

      <Field
        label="Product photo"
        error={fieldError("image")}
        hint="PNG, JPEG or WebP, up to 5 MB. A vial on a dark background looks best — it's shown centered and uncropped. Leave empty to keep the current photo."
      >
        <div className="flex items-center gap-4">
          <div className="w-24 h-32 rounded-lg border border-line-strong bg-bg-2 grid place-items-center overflow-hidden shrink-0">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="w-full h-full object-contain" />
            ) : (
              <span className="text-muted text-[0.7rem]">No photo</span>
            )}
          </div>
          <div className="flex flex-col gap-2 min-w-0">
            <input
              ref={fileRef}
              name="image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
                setPreview(file ? URL.createObjectURL(file) : initial?.imageUrl || null);
                if (file) setRemove(false);
              }}
              className="text-[0.85rem] file:mr-3 file:rounded-full file:border-0 file:bg-accent file:text-accent-ink file:font-semibold file:px-4 file:py-2 file:cursor-pointer"
            />
            {initial?.imageUrl && (
              <span className="flex items-center gap-2 text-[0.82rem] text-muted">
                <input
                  id="removeImage"
                  type="checkbox"
                  name="removeImage"
                  checked={remove}
                  onChange={(e) => {
                    setRemove(e.target.checked);
                    if (e.target.checked) {
                      if (fileRef.current) fileRef.current.value = "";
                      setPreview(null);
                    } else {
                      setPreview(initial.imageUrl || null);
                    }
                  }}
                  className="accent-accent"
                />
                <label htmlFor="removeImage">Remove current photo</label>
              </span>
            )}
          </div>
        </div>
      </Field>

      <Field label="Batch number" error={fieldError("batchNumber")} hint="Optional — shown on the COAs page">
        <input
          name="batchNumber"
          defaultValue={initial?.batchNumber}
          className="w-full bg-bg-2 border border-line-strong rounded-[10px] px-4 py-3"
        />
      </Field>

      <Field label="Purity" error={fieldError("purity")} hint="Optional — e.g. 99.2%">
        <input
          name="purity"
          defaultValue={initial?.purity}
          className="w-full bg-bg-2 border border-line-strong rounded-[10px] px-4 py-3"
        />
      </Field>

      <Field label="COA link (PDF/image URL)" error={fieldError("coaUrl")} hint="Optional — items without one show “COA on request”">
        <input
          name="coaUrl"
          defaultValue={initial?.coaUrl}
          className="w-full bg-bg-2 border border-line-strong rounded-[10px] px-4 py-3"
        />
      </Field>

      <label className="flex items-center gap-3 text-[0.9rem]">
        <input
          type="checkbox"
          name="active"
          defaultChecked={initial?.active ?? true}
          className="accent-accent w-[17px] h-[17px]"
        />
        <span>Visible in the shop</span>
      </label>

      <label className="flex items-center gap-3 text-[0.9rem]">
        <input type="checkbox" name="outOfStock" defaultChecked={initial?.outOfStock ?? false} className="accent-accent w-[17px] h-[17px]" />
        <span>Out of stock — keep visible, disable purchases</span>
      </label>

      {state.error && <p className="text-danger text-[0.85rem]">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-[0.94rem] bg-gradient-to-br from-accent to-accent-2 text-accent-ink disabled:opacity-60"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[0.8rem] text-muted font-semibold">{label}</span>
      {children}
      {hint && !error && <span className="text-muted text-[0.76rem]">{hint}</span>}
      {error && <span className="text-danger text-[0.78rem]">{error}</span>}
    </label>
  );
}
