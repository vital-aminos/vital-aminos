export function formatCents(cents: number): string {
  return (cents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

export function dollarsToCents(input: string | number): number {
  const n = typeof input === "string" ? Number(input) : input;
  if (!Number.isFinite(n) || n < 0) return NaN;
  return Math.round(n * 100);
}
