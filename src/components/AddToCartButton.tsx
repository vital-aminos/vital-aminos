"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart-client";

export default function AddToCartButton({
  itemId,
  isSignedIn,
  className,
}: {
  itemId: string;
  isSignedIn: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [added, setAdded] = useState(false);

  function handleClick() {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    addToCart(itemId, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ??
        "mt-auto w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-[0.94rem] border border-line-strong bg-white/[0.02] backdrop-blur-sm hover:border-accent hover:text-accent hover:bg-accent-soft transition-colors"
      }
    >
      {added ? "Added ✓" : "Add to cart"}
    </button>
  );
}
