"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/actions/contact";

const input =
  "w-full bg-bg-2 border border-line-strong rounded-[10px] px-4 py-3 focus:outline-none focus:border-accent";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(submitContact, {});

  if (state.sent) {
    return (
      <div className="bg-panel border border-line rounded-2xl p-8 text-center">
        <h2 className="text-[1.4rem] mb-2">Message sent</h2>
        <p className="text-muted">Thanks for reaching out — we&apos;ll reply by email soon.</p>
      </div>
    );
  }

  const err = (k: string) => state.fieldErrors?.[k];
  return (
    <form action={formAction} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className="text-[0.8rem] text-muted font-semibold">Name</span>
        <input name="name" required className={input} />
        {err("name") && <span className="text-danger text-[0.8rem]">{err("name")}</span>}
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-[0.8rem] text-muted font-semibold">Email</span>
        <input name="email" type="email" required className={input} />
        {err("email") && <span className="text-danger text-[0.8rem]">{err("email")}</span>}
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-[0.8rem] text-muted font-semibold">Message</span>
        <textarea name="message" rows={6} required className={input} />
        {err("message") && <span className="text-danger text-[0.8rem]">{err("message")}</span>}
      </label>
      {/* Honeypot — hidden from people, tempting to bots */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
      {state.error && <p className="text-danger text-[0.85rem]">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center px-6 py-3.5 rounded-full font-semibold text-[0.95rem] bg-gradient-to-br from-accent to-accent-2 text-accent-ink disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
