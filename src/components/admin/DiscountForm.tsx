"use client";

import { useActionState } from "react";
import { saveDiscount, type DiscountFormState } from "@/actions/settings";

export default function DiscountForm({ enabled, percent }: { enabled: boolean; percent: number }) {
  const [state, formAction, pending] = useActionState<DiscountFormState, FormData>(saveDiscount, {});
  return (
    <form
      action={formAction}
      className="flex flex-col gap-6 max-w-[420px] bg-panel border border-line rounded-2xl p-6"
    >
      <label className="flex items-center gap-3">
        <input type="checkbox" name="enabled" defaultChecked={enabled} className="accent-accent w-[18px] h-[18px]" />
        <span className="font-semibold">Discount is ON (shown to all shoppers)</span>
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-[0.8rem] text-muted font-semibold">Percent off (1–90)</span>
        <input
          name="percent"
          type="number"
          min={1}
          max={90}
          defaultValue={percent}
          required
          className="bg-bg-2 border border-line-strong rounded-[10px] px-4 py-3 w-32"
        />
      </label>
      {state.error && <p className="text-danger text-[0.85rem]">{state.error}</p>}
      {state.saved && <p className="text-accent text-[0.85rem]">Saved — live on the site now.</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-start px-6 py-2.5 rounded-full font-semibold text-[0.9rem] bg-gradient-to-br from-accent to-accent-2 text-accent-ink disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
