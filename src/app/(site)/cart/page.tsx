"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import CartQuantity from "@/components/CartQuantity";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onCartChange, readCart, removeFromCart, setCartQuantity } from "@/lib/cart-client";
import { getCartDetails, placeOrder } from "@/actions/orders";
import { cartEntries } from "@/lib/product-options";
import { clearCart } from "@/lib/cart-client";
import { formatCents } from "@/lib/money";

type CartLine = Awaited<ReturnType<typeof getCartDetails>>["lines"][number];

export default function CartPage() {
  const router = useRouter();
  const refreshVersion = useRef(0);
  const [refreshing, setRefreshing] = useState(false);
  const [lines, setLines] = useState<CartLine[] | null>(null);
  const [totalCents, setTotalCents] = useState(0);
  const [unavailable, setUnavailable] = useState<Awaited<ReturnType<typeof getCartDetails>>["unavailable"]>([]);
  const [placing, startPlacing] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<string | null>(null);

  async function refresh() {
    const cart = readCart();
    const entries = cartEntries(cart);
    const version = ++refreshVersion.current;
    setRefreshing(true);
    try {
      const result = await getCartDetails(entries);
      if (version !== refreshVersion.current) return;
      setLines(result.lines);
      setTotalCents(result.totalCents);
      setUnavailable(result.unavailable);
      setError(null);
    } catch {
      if (version !== refreshVersion.current) return;
      setError("Couldn't update your cart. Please refresh the page and try again.");
      setLines(current => current ?? []);
    } finally {
      if (version === refreshVersion.current) setRefreshing(false);
    }
  }

  useEffect(() => {
    // Cart contents live in localStorage, only readable client-side, so the
    // initial load has to happen in an effect rather than during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    return onCartChange(refresh);
  }, []);

  function handleQuantity(itemId: string, quantity: number) {
    setLines(current => current?.map(line => line.cartKey === itemId ? { ...line, quantity, lineTotalCents: line.priceCents * quantity } : line) ?? null);
    setCartQuantity(itemId, quantity);
  }

  function handleRemove(itemId: string) {
    removeFromCart(itemId);
  }

  function handlePlaceOrder() {
    setError(null);
    const cart = readCart();
    const entries = cartEntries(cart);
    startPlacing(async () => {
      const result = await placeOrder(entries);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setPlaced(result.orderId);
      clearCart();
      router.refresh();
    });
  }

  if (lines === null) {
    return <div className="max-w-[800px] mx-auto px-6 py-20 text-muted">Loading your cart…</div>;
  }

  if (placed) {
    return (
      <div className="max-w-[600px] mx-auto px-6 py-20 text-center">
        <h1 className="text-[1.9rem] mb-3">Order placed</h1>
        <p className="text-muted mb-8">
          Thanks — your order has been received and is awaiting payment setup. We&apos;ll follow up
          with payment instructions shortly.
        </p>
        <Link
          href="/orders"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-[0.94rem] bg-gradient-to-br from-accent to-accent-2 text-accent-ink"
        >
          View my orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-6 py-14 md:py-20">
      <h1 className="text-[1.9rem] mb-8">Your cart</h1>

      {error && <p role="alert" className="text-danger text-sm mb-4">{error}</p>}
      {unavailable.length > 0 && (
        <div className="border border-danger/40 rounded-xl p-4 mb-6" role="alert">
          <p className="text-sm text-muted mb-3">These products or compound content options are no longer available. Remove them and choose an available option from the product page.</p>
          {unavailable.map(line => (
            <div key={line.cartKey} className="flex items-center justify-between gap-3 py-2 text-sm">
              <span>{line.name}{line.strength ? ` (${line.strength})` : ""} — {line.reason}</span>
              <button type="button" onClick={() => handleRemove(line.cartKey)} className="text-danger">Remove</button>
            </div>
          ))}
        </div>
      )}

      {lines.length === 0 ? (
        <p className="text-muted">
          Your cart is empty.{" "}
          <Link href="/compounds" className="text-accent hover:underline">
            Browse products →
          </Link>
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-4 mb-10">
            {lines.map((line) => (
              <div
                key={line.cartKey}
                className="flex flex-wrap items-center gap-4 bg-panel border border-line rounded-2xl p-4"
              >
                {line.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={line.imageUrl} alt={line.name} className="w-16 h-16 rounded-lg object-contain bg-[#07101e] border border-line" />
                ) : (
                  <div className="w-16 h-16 rounded-lg grid place-items-center text-accent font-serif bg-gradient-to-br from-[#0f1c33] to-[#07101e] border border-line">
                    {line.name.split(" ")[0]}
                  </div>
                )}
                <div className="flex-1">
                  <Link href={`/item/${line.slug}`} className="font-semibold hover:text-accent transition-colors">
                    {line.name}
                  </Link>
                  {line.strength && <p className="text-muted text-sm">{line.strength}</p>}
                  <p className="text-muted text-[0.85rem]">
                    {line.discountPercent > 0 && (
                      <s className="mr-2 opacity-80">{formatCents(line.originalPriceCents)}</s>
                    )}
                    {formatCents(line.priceCents)} each
                  </p>
                </div>
                <CartQuantity key={`${line.cartKey}:${line.quantity}`} quantity={line.quantity} name={`${line.name}${line.strength ? ` (${line.strength})` : ""}`} disabled={placing} onChange={quantity => handleQuantity(line.cartKey, quantity)} />
                <span className="w-24 text-right font-semibold">{formatCents(line.lineTotalCents)}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(line.cartKey)}
                  className="text-muted hover:text-danger transition-colors text-[0.85rem]"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-line pt-6 mb-8">
            <span className="text-muted">Total</span>
            <span className="text-[1.3rem] font-semibold text-accent">{formatCents(totalCents)}</span>
          </div>



          <button
            type="button"
            disabled={placing || refreshing || !!error || unavailable.length > 0}
            onClick={handlePlaceOrder}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-[0.95rem] bg-gradient-to-br from-accent to-accent-2 text-accent-ink disabled:opacity-60"
          >
            {placing ? "Placing order…" : refreshing ? "Updating cart…" : "Place order"}
          </button>
          <p className="text-muted text-[0.78rem] mt-3 text-center">
            Payment is not collected yet — orders are recorded as pending and you&apos;ll be
            contacted with payment details.
          </p>
        </>
      )}
    </div>
  );
}
