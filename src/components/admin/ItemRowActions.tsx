"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteItem, toggleItemActive } from "@/actions/items";

export default function ItemRowActions({ id, active }: { id: string; active: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleItemActive(id, !active);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!window.confirm("Delete this item permanently? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteItem(id);
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-3 text-[0.82rem]">
      <button
        type="button"
        disabled={pending}
        onClick={handleToggle}
        className="text-muted hover:text-accent transition-colors disabled:opacity-50"
      >
        {active ? "Hide" : "Show"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={handleDelete}
        className="text-muted hover:text-danger transition-colors disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
