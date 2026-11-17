"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteItem, toggleItemActive } from "@/actions/items";

// Large tap targets and an inline confirmation (not window.confirm, which many
// mobile and in-app browsers suppress, silently cancelling the delete).
const btn = "min-h-[40px] px-3 rounded-lg border border-line-strong text-[0.85rem] disabled:opacity-50";

export default function ItemRowActions({ id, active }: { id: string; active: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleToggle() {
    setError(null);
    startTransition(async () => {
      await toggleItemActive(id, !active);
      router.refresh();
    });
  }

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteItem(id);
      if (!result.ok) {
        setError(result.error);
        setConfirming(false);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-2 items-start">
      {confirming ? (
        <div className="flex flex-wrap items-center gap-2" role="alertdialog" aria-label="Confirm delete">
          <span className="text-[0.82rem] text-danger">Delete permanently?</span>
          <button type="button" disabled={pending} onClick={handleDelete} className={`${btn} border-danger/60 text-danger`}>
            {pending ? "Deleting…" : "Yes, delete"}
          </button>
          <button type="button" disabled={pending} onClick={() => setConfirming(false)} className={`${btn} text-muted`}>
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button type="button" disabled={pending} onClick={handleToggle} className={`${btn} text-muted hover:text-accent hover:border-accent`}>
            {active ? "Hide" : "Show"}
          </button>
          <button type="button" disabled={pending} onClick={() => setConfirming(true)} className={`${btn} text-muted hover:text-danger hover:border-danger/60`}>
            Delete
          </button>
        </div>
      )}
      {error && <p role="alert" className="text-danger text-[0.8rem] max-w-[34ch]">{error}</p>}
    </div>
  );
}
