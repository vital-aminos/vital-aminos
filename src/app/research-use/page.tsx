import type { Metadata } from "next";
import Link from "next/link";
import { PAGE_WRAP } from "@/lib/catalog";

export const metadata: Metadata = { title: "Research Use Policy — Vital Aminos" };

export default function ResearchUsePage() {
  return (
    <article className={`${PAGE_WRAP} py-14 md:py-20`}>
      <div className="max-w-[72ch] space-y-6">
        <h1 className="text-3xl text-white">Research use policy</h1>
        <p className="text-muted">Vital Aminos supplies research compounds and laboratory materials exclusively to qualified researchers and institutions. Customers must be at least 21 years old.</p>
        <p className="text-muted">Products are intended strictly for lawful laboratory, in-vitro, or analytical research. They are not intended for human or animal consumption, medical treatment, diagnostic use, or therapeutic use.</p>
        <p className="text-muted">Materials must be handled by trained professionals in an appropriate laboratory environment. Compound content labels describe the product being supplied; they are not instructions for administration. Vital Aminos does not provide dosing guidance or medical advice.</p>
        <p className="text-muted">Review the product listing and batch-specific Certificate of Analysis where available. <Link href="/contact" className="text-accent hover:underline">Contact us</Link> with questions about a product or its documentation.</p>
        <Link href="/terms" className="inline-block text-accent hover:underline">Read the terms of sale →</Link>
      </div>
    </article>
  );
}
