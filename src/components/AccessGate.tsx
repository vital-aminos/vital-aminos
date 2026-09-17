"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "va_access_grant";
const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

const ROLES = [
  "Principal Investigator",
  "Research Scientist",
  "Postdoctoral Researcher",
  "Laboratory Director",
  "Research Associate",
  "Graduate Researcher",
  "Clinical Researcher",
  "Biochemist",
  "Pharmacologist",
  "Toxicologist",
  "Academic / Faculty",
  "Independent Researcher",
  "Other",
];

function readGrant(): { role: string; expires: number } | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data.expires !== "number") return null;
    if (Date.now() > data.expires) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export default function AccessGate({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<boolean | null>(null); // null = not yet determined (avoids flash)
  const [role, setRole] = useState("");
  const [affirm, setAffirm] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // localStorage is only readable client-side, so this one-time check on
    // mount can't be derived during render — it has to run in an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(!readGrant());
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = role !== "" && affirm;
    setError(!ok);
    if (!ok) return;
    if (remember) {
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ role, expires: Date.now() + FIVE_DAYS_MS })
        );
      } catch {
        /* storage unavailable — session-only access */
      }
    }
    setOpen(false);
  }

  if (open === null) return null; // avoid flashing gate/site before we know
  if (!open) return <>{children}</>;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center p-6 overflow-y-auto"
      style={{
        background:
          "radial-gradient(1000px 700px at 50% -20%, rgba(129,140,248,0.2), transparent 60%), radial-gradient(900px 600px at 50% 120%, rgba(94,234,212,0.14), transparent 60%), #050609",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
    >
      <div className="w-full max-w-[540px] bg-gradient-to-b from-panel-2 to-panel border border-line-strong rounded-3xl p-10">
        <p className="inline-block uppercase tracking-[0.22em] text-[0.68rem] text-accent mb-3 font-bold">
          Research access
        </p>
        <h1 id="gate-title" className="text-[1.75rem] mb-3">
          Qualified research customers only
        </h1>
        <p className="text-muted text-[0.95rem] mb-6">
          This site provides research compounds and laboratory materials exclusively for
          qualified researchers and institutions. Products are sold strictly for lawful
          in-vitro or laboratory research and are <strong>not for human or veterinary use</strong>.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-[0.8rem] text-muted font-semibold">Your research role</span>
            <select
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="appearance-none bg-bg-2 text-text border border-line-strong rounded-[10px] px-[15px] py-[13px] pr-10"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none' stroke='%2397a1b4' stroke-width='2'%3E%3Cpath d='M3 5l4 4 4-4'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 16px center",
              }}
            >
              <option value="" disabled>
                Select a role…
              </option>
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>

          <label className="flex gap-3 text-[0.85rem] text-muted">
            <input
              type="checkbox"
              checked={affirm}
              onChange={(e) => setAffirm(e.target.checked)}
              className="mt-0.5 accent-accent w-[17px] h-[17px] shrink-0"
            />
            <span>
              I am at least <strong>21 years of age</strong>. I affirm that I am an independent
              researcher or represent a qualified laboratory, clinic, educational institution, or
              other research organization. I understand these products are for lawful in-vitro or
              laboratory research only, must be handled only by experienced professionals, and are{" "}
              <strong>not for human or veterinary use</strong>.
            </span>
          </label>

          <label className="flex items-center gap-3 text-[0.85rem] text-muted">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="accent-accent w-[17px] h-[17px] shrink-0"
            />
            <span>Remember me for 5 days</span>
          </label>

          {error && (
            <p className="text-danger text-[0.85rem]" role="alert">
              Please select a role and confirm the statement above to continue.
            </p>
          )}

          <div className="flex gap-3 flex-wrap mt-1.5">
            <button
              type="submit"
              className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-[0.94rem] bg-gradient-to-br from-accent to-accent-2 text-accent-ink shadow-[0_10px_30px_-10px_var(--accent-glow)] hover:-translate-y-0.5 transition-transform"
            >
              Enter Vital Aminos
            </button>
            <a
              href="https://www.google.com"
              className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-[0.94rem] border border-line-strong bg-white/[0.02]"
            >
              Decline &amp; exit
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
