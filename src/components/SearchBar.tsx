/** Plain GET form → /search?q=… — works without JS and is server-rendered. */
export default function SearchBar({
  defaultValue = "",
  className = "",
  autoFocus = false,
}: {
  defaultValue?: string;
  className?: string;
  autoFocus?: boolean;
}) {
  return (
    <form action="/search" method="get" role="search" className={`relative ${className}`}>
      <svg
        aria-hidden="true"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        placeholder="Search compounds, batches…"
        aria-label="Search"
        className="w-full bg-bg-2 border border-line-strong rounded-full pl-10 pr-4 py-2.5 text-[0.9rem] focus:outline-none focus:border-accent"
      />
    </form>
  );
}
