"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "va_cookie_notice";

/**
 * Bottom-right notice about cookies / local storage and data collection.
 * The site only uses essential storage (sign-in session, cart, access
 * confirmation), so this is an acknowledgement rather than an opt-in.
 * If non-essential cookies (analytics, ads) are ever added, this must become
 * a real consent prompt that blocks them until accepted.
 */
export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      /* storage blocked — just show the notice each visit */
    }
    // localStorage is client-only, so this one-time read has to happen in an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(!seen);
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ acknowledged: true, at: new Date().toISOString() })
      );
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookies and data collection"
      className="fixed z-[110] bottom-4 right-4 left-4 sm:left-auto sm:w-[380px] bg-gradient-to-b from-panel-2 to-panel border border-line-strong rounded-2xl p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]"
    >
      <h2 className="text-[1rem] mb-1.5">Cookies &amp; your data</h2>
      <p className="text-muted text-[0.84rem] leading-relaxed mb-4">
        We use only essential cookies and local storage to keep you signed in, remember your cart
        and your research-use confirmation. We don&apos;t use advertising or analytics cookies.
        We collect your account details and order information to run the store. See our{" "}
        <Link href="/privacy" className="text-accent hover:underline">
          Privacy Policy
        </Link>{" "}
        for details.
      </p>
      <div className="flex gap-2.5 flex-wrap">
        <button
          type="button"
          onClick={dismiss}
          className="flex-1 inline-flex items-center justify-center px-5 py-2.5 rounded-full font-semibold text-[0.88rem] bg-gradient-to-br from-accent to-accent-2 text-accent-ink"
        >
          Got it
        </button>
        <Link
          href="/privacy#cookies"
          onClick={dismiss}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-full font-semibold text-[0.88rem] border border-line-strong hover:border-accent hover:text-accent transition-colors"
        >
          Learn more
        </Link>
      </div>
    </div>
  );
}
