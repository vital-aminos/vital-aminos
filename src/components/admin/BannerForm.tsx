"use client";

import { useActionState } from "react";
import { saveBanner, type BannerFormState } from "@/actions/settings";
import { BANNER_MAX_LENGTH } from "@/lib/banner";

export default function BannerForm({ text }: { text: string }) {
  const [state, formAction, pending] = useActionState<BannerFormState, FormData>(saveBanner, {});
  return (
    <form
      action={formAction}
      className="flex flex-col gap-6 max-w-[520px] bg-panel border border-line rounded-2xl p-6"
    >
      <label className="flex flex-col gap-2">
        <span className="text-[0.8rem] text-muted font-semibold">Banner text</span>
        <input
          name="text"
          type="text"
          defaultValue={text}
          maxLength={BANNER_MAX_LENGTH}
          placeholder="e.g. Free shipping on orders $150+"
          className="bg-bg-2 border border-line-strong rounded-[10px] px-4 py-3 w-full"
        />
        <span className="text-muted text-[0.76rem]">
          Leave blank to hide the banner text. The sitewide discount message, if on, still shows.
        </span>
      </label>
      {state.error && <p role="alert" className="text-danger text-[0.85rem]">{state.error}</p>}
      {state.saved && <p role="status" className="text-accent text-[0.85rem]">Saved — live on the site now.</p>}
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
