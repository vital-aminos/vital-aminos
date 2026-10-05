import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getDiscount } from "@/lib/settings";

// Product listing and cart/session state are always live — never prerender at build time.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [session, items, discount] = await Promise.all([
    auth(),
    prisma.item.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } }),
    getDiscount(),
  ]);

  const isSignedIn = !!session?.user;
  // Home is a teaser; the full catalog lives on /compounds.
  const featured = items.slice(0, 3);

  return (
    <>
      <section className="grid md:grid-cols-[1.1fr_0.9fr] gap-14 items-center py-16 md:py-[104px] max-w-[1140px] mx-auto px-[clamp(16px,5vw,56px)]">
        <div>
          <p className="inline-block uppercase tracking-[0.22em] text-[0.68rem] text-accent mb-3 font-bold">
            For Research Use Only
          </p>
          <h1 className="text-[clamp(2.4rem,5.5vw,3.7rem)] mb-5 bg-gradient-to-b from-white to-[#b9c2d4] bg-clip-text text-transparent">
            High-Purity Research Peptides
          </h1>
          <p className="text-muted text-[1.08rem] max-w-[46ch]">
            Purity-focused standards. COA included with every batch. Discreet fulfillment
            for qualified laboratories and independent researchers.
          </p>
          <div className="flex gap-3.5 my-7 flex-wrap">
            <a
              href="/compounds"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-[0.94rem] bg-gradient-to-br from-accent to-accent-2 text-accent-ink shadow-[0_10px_30px_-10px_var(--accent-glow)] hover:-translate-y-0.5 transition-transform"
            >
              Shop research peptides
            </a>
            <a
              href="/coas"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-[0.94rem] border border-line-strong bg-white/[0.02] hover:border-accent hover:text-accent hover:bg-accent-soft transition-colors"
            >
              View COA library
            </a>
          </div>
          <ul className="flex gap-2.5 flex-wrap list-none p-0 m-0">
            {["Purity-Focused Standards", "COA Included", "For Research Use Only"].map((b) => (
              <li
                key={b}
                className="text-[0.76rem] font-semibold text-accent border border-line-strong bg-accent-soft py-[7px] px-3.5 rounded-full"
              >
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative h-[260px] md:h-[360px] flex gap-6 items-end justify-center">
          <div className="absolute -inset-x-0 -inset-y-[10%] blur-2xl" style={{ background: "radial-gradient(closest-side, rgba(94,234,212,0.18), transparent)" }} />
          {[0, -2, -4].map((delay, i) => (
            <div
              key={i}
              className="relative w-[74px] rounded-t-2xl rounded-b-lg border border-line-strong backdrop-blur-sm"
              style={{
                height: i === 1 ? 278 : i === 2 ? 190 : 220,
                background:
                  "linear-gradient(180deg, rgba(94,234,212,0.4), rgba(129,140,248,0.12) 44%, var(--panel) 45%)",
                animation: `float 6s ease-in-out ${delay}s infinite`,
              }}
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-9 h-4 rounded-[5px] bg-[#2b2f3d]" />
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1140px] mx-auto px-[clamp(16px,5vw,56px)] py-16 md:py-20 border-b border-line">
        <div className="flex items-end justify-between gap-4 mb-9 flex-wrap">
          <div className="max-w-[60ch]">
            <h2 className="text-[clamp(1.6rem,3vw,2.1rem)] mb-2.5">Featured research compounds</h2>
            <p className="text-muted">Every listing ships with a batch-specific Certificate of Analysis.</p>
          </div>
          <Link href="/compounds" className="text-accent hover:underline text-[0.9rem]">
            View all compounds →
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="text-muted">
            No products are listed yet.
            {session?.user?.isAdmin && (
              <>
                {" "}
                <Link href="/admin/items/new" className="text-accent hover:underline">
                  Add your first item →
                </Link>
              </>
            )}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((item) => (
              <ProductCard key={item.id} item={item} isSignedIn={isSignedIn} discountPercent={discount.percent} />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-[1140px] mx-auto px-[clamp(16px,5vw,56px)] py-16 md:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { href: "/compounds", title: "Compounds", body: "Browse the full catalog of research peptides and blends." },
            { href: "/coas", title: "COAs", body: "Batch-specific certificates of analysis, mass spec and HPLC." },
            { href: "/about", title: "About us", body: "Who we supply and our research-use-only policy." },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="bg-gradient-to-b from-panel-2 to-panel border border-line rounded-2xl p-7 hover:-translate-y-1 hover:border-accent transition-all"
            >
              <h3 className="text-[1.15rem] mb-2.5 text-accent">{c.title} →</h3>
              <p className="text-muted text-[0.9rem]">{c.body}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
