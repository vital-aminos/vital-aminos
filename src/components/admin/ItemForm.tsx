"use client";

import { useActionState, useState } from "react";
import type { ItemFormState } from "@/actions/items";

export type ItemFormValues = {
  name: string;
  slug: string;
  description: string;
  note: string;
  price: string; // dollars, e.g. "60.00"
  imageUrl: string;
  active: boolean;
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
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");

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

      <Field label="Image URL" error={fieldError("imageUrl")} hint="Optional — leave blank to show a placeholder">
        <div className="flex items-center gap-3">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt=""
              className="w-14 h-14 rounded-lg object-cover border border-line shrink-0"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
              }}
            />
          ) : (
            <div className="w-14 h-14 rounded-lg border border-dashed border-line-strong shrink-0" />
          )}
          <input
            name="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1 bg-bg-2 border border-line-strong rounded-[10px] px-4 py-3"
          />
        </div>
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
