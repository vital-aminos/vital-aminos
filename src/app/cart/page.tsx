"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { onCartChange, readCart, removeFromCart, setCartQuantity } from "@/lib/cart-client";
import { getCartDetails, placeOrder } from "@/actions/orders";
import { formatCents } from "@/lib/money";

type CartLine = Awaited<ReturnType<typeof getCartDetails>>["lines"][number];

export default function CartPage() {
  const router = useRouter();
  const [lines, setLines] = useState<CartLine[] | null>(null);
  const [totalCents, setTotalCents] = useState(0);
  const [placing, startPlacing] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<string | null>(null);

  async function refresh() {
    const cart = readCart();
    const entries = Object.entries(cart).map(([itemId, quantity]) => ({ itemId, quantity }));
    const result = await getCartDetails(entries);
    setLines(result.lines);
    setTotalCents(result.totalCents);
  }

  useEffect(() => {
    // Cart contents live in localStorage, only readable client-side, so the
    // initial load has to happen in an effect rather than during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    return onCartChange(refresh);
  }, []);

  function handleQuantity(itemId: string, quantity: number) {
    setCartQuantity(itemId, quantity);
  }

  function handleRemove(itemId: string) {
    removeFromCart(itemId);
  }

  function handlePlaceOrder() {
    setError(null);
    const cart = readCart();
    const entries = Object.entries(cart).map(([itemId, quantity]) => ({ itemId, quantity }));
    startPlacing(async () => {
      const result = await placeOrder(entries);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      window.localStorage.removeItem("va_cart");
      setPlaced(result.orderId);
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

      {lines.length === 0 ? (
        <p className="text-muted">
          Your cart is empty.{" "}
          <Link href="/#shop" className="text-accent hover:underline">
            Browse products →
          </Link>
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-4 mb-10">
            {lines.map((line) => (
              <div
                key={line.itemId}
                className="flex items-center gap-4 bg-panel border border-line rounded-2xl p-4"
              >
                {line.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={line.imageUrl} alt={line.name} className="w-16 h-16 rounded-lg object-cover border border-line" />
                ) : (
                  <div className="w-16 h-16 rounded-lg grid place-items-center text-accent font-serif bg-gradient-to-br from-[#1c2130] to-[#0f121b] border border-line">
                    {line.name.split(" ")[0]}
                  </div>
                )}
                <div className="flex-1">
                  <Link href={`/item/${line.slug}`} className="font-semibold hover:text-accent transition-colors">
                    {line.name}
                  </Link>
                  <p className="text-muted text-[0.85rem]">{formatCents(line.priceCents)} each</p>
                </div>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={line.quantity}
                  onChange={(e) => handleQuantity(line.itemId, Number(e.target.value))}
                  className="w-16 bg-bg-2 border border-line-strong rounded-lg px-2 py-1.5 text-center"
                />
                <span className="w-24 text-right font-semibold">{formatCents(line.lineTotalCents)}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(line.itemId)}
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

          {error && <p className="text-danger text-[0.85rem] mb-4">{error}</p>}

          <button
            type="button"
            disabled={placing}
            onClick={handlePlaceOrder}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-semibold text-[0.95rem] bg-gradient-to-br from-accent to-accent-2 text-accent-ink disabled:opacity-60"
          >
            {placing ? "Placing order…" : "Place order"}
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
