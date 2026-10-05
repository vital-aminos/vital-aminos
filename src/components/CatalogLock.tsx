import Link from "next/link";

/** Blurred placeholder + sign-in prompt shown to guests after their glimpse of the catalog. */
export default function CatalogLock({
  lockedCount,
  what = "research compound",
  callbackUrl = "/",
}: {
  lockedCount: number;
  what?: string;
  callbackUrl?: string;
}) {
  return (
    <div className="relative mt-6 rounded-2xl overflow-hidden border border-line">
      <div
        aria-hidden="true"
        className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 blur-md select-none pointer-events-none opacity-60"
      >
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-56 rounded-2xl bg-gradient-to-b from-panel-2 to-panel border border-line" />
        ))}
      </div>
      <div className="absolute inset-0 grid place-items-center p-6 bg-bg/60">
        <div className="text-center max-w-[420px]">
          <h3 className="text-[1.3rem] mb-2">Sign in to see more</h3>
          <p className="text-muted text-[0.9rem] mb-5">
            {lockedCount > 0
              ? `${lockedCount} more ${what}${lockedCount === 1 ? "" : "s"} are available to signed-in researchers.`
              : "The full catalog is available to signed-in researchers."}
          </p>
          <Link
            href={`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full font-semibold text-[0.94rem] bg-gradient-to-br from-accent to-accent-2 text-accent-ink"
          >
            Sign in to continue
          </Link>
        </div>
      </div>
    </div>
  );
}
