import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GUEST_GLIMPSE, PAGE_WRAP } from "@/lib/catalog";
import CatalogLock from "@/components/CatalogLock";

export const metadata: Metadata = { title: "COAs — Vital Aminos" };
export const dynamic = "force-dynamic";

export default async function CoasPage() {
  const [session, items] = await Promise.all([
    auth(),
    prisma.item.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ]);
  const isSignedIn = !!session?.user;
  const visible = isSignedIn ? items : items.slice(0, GUEST_GLIMPSE);

  return (
    <div className={`${PAGE_WRAP} py-14 md:py-20`}>
      <div className="max-w-[60ch] mb-11">
        <h1 className="text-[clamp(1.9rem,4vw,2.6rem)] mb-2.5">Certificates of analysis</h1>
        <p className="text-muted">
          Third-party mass spec and HPLC results, published per batch. Items without a posted COA
          are available on request.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-muted">No compounds are listed yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 flex-wrap bg-gradient-to-b from-panel-2 to-panel border border-line rounded-2xl px-5 py-4"
            >
              <div className="flex-1 min-w-[200px]">
                <Link href={`/item/${item.slug}`} className="font-semibold hover:text-accent transition-colors">
                  {item.name}
                </Link>
                <p className="text-muted text-[0.8rem]">
                  {item.batchNumber ? `Batch ${item.batchNumber}` : "Batch not listed"}
                  {item.purity ? ` • Purity ${item.purity}` : ""}
                </p>
              </div>
              {item.coaUrl ? (
                <a
                  href={item.coaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-2 rounded-full font-semibold text-[0.85rem] border border-line-strong hover:border-accent hover:text-accent hover:bg-accent-soft transition-colors"
                >
                  View COA ↗
                </a>
              ) : (
                <Link href="/contact" className="text-[0.82rem] text-muted hover:text-accent transition-colors">
                  COA on request →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
      {!isSignedIn && items.length > 0 && (
        <CatalogLock lockedCount={items.length - visible.length} what="COA" callbackUrl="/coas" />
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
        {[
          { t: "COA Documentation", b: "Third-party mass spec and HPLC results published per batch." },
          { t: "Clear Strengths & Formats", b: "Exact mg strengths, vial counts, and reconstitution notes — no ambiguous labeling." },
          { t: "Discreet Fulfillment", b: "Plain, temperature-conscious packaging with tracking on every order." },
        ].map((c) => (
          <article key={c.t} className="bg-gradient-to-b from-panel-2 to-panel border border-line rounded-2xl p-7">
            <h3 className="text-[1.1rem] mb-2.5 text-accent">{c.t}</h3>
            <p className="text-muted text-[0.9rem]">{c.b}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
