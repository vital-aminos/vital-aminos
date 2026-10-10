"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cartCount, onCartChange, readCart } from "@/lib/cart-client";

export default function CartBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(cartCount(readCart()));
    update();
    return onCartChange(update);
  }, []);

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center rounded-full border border-line-strong bg-white/[0.02] w-9 h-9 text-text/90 hover:border-accent hover:text-accent transition-colors"
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L22 8H6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="21" r="1.4" />
        <circle cx="18" cy="21" r="1.4" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-br from-accent to-accent-2 text-accent-ink text-[10px] font-bold flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}
