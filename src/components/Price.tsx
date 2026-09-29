import { formatCents } from "@/lib/money";
import { applyDiscount } from "@/lib/settings";

/** Shows the struck-through original price plus the discounted price when percent > 0. */
export default function Price({
  cents,
  percent,
  className = "",
}: {
  cents: number;
  percent: number;
  className?: string;
}) {
  if (percent <= 0) return <span className={className}>{formatCents(cents)}</span>;
  return (
    <span className={`inline-flex items-baseline gap-2 flex-wrap ${className}`}>
      <s className="text-muted font-normal opacity-80">{formatCents(cents)}</s>
      <span>{formatCents(applyDiscount(cents, percent))}</span>
      <span className="text-[0.68rem] font-bold uppercase tracking-wide text-accent-ink bg-accent rounded-full px-2 py-0.5">
        {percent}% off
      </span>
    </span>
  );
}
