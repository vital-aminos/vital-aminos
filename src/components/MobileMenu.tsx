"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

type NavLink = { href: string; label: string; hint?: string };

export default function MobileMenu({
  links,
  isSignedIn,
}: {
  links: NavLink[];
  isSignedIn: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="site-menu"
        className="grid place-items-center w-10 h-10 rounded-xl border border-line-strong hover:border-accent hover:bg-accent-soft transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open &&
        createPortal(
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Site navigation">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default"
          />
          <aside
            id="site-menu"
            className="absolute right-0 top-0 h-full w-[min(360px,88vw)] bg-gradient-to-b from-panel-2 to-panel border-l border-line-strong p-6 flex flex-col gap-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <span className="font-serif text-[1.1rem]">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid place-items-center w-9 h-9 rounded-lg border border-line-strong hover:border-accent"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <SearchBar />

            <nav className="flex flex-col">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-3.5 border-b border-line flex flex-col hover:text-accent transition-colors"
                >
                  <span className="font-semibold">{l.label}</span>
                  {l.hint && <span className="text-muted text-[0.78rem]">{l.hint}</span>}
                </Link>
              ))}
            </nav>

            {!isSignedIn && (
              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className="mt-auto inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-[0.94rem] bg-gradient-to-br from-accent to-accent-2 text-accent-ink"
              >
                Sign in
              </Link>
            )}
          </aside>
        </div>,
        document.body
      )}
    </>
  );
}
