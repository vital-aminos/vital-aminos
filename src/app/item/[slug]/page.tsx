import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatCents } from "@/lib/money";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [session, item] = await Promise.all([
    auth(),
    prisma.item.findUnique({ where: { slug } }),
  ]);

  if (!item || (!item.active && !session?.user?.isAdmin)) notFound();

  return (
    <div className="max-w-[1140px] mx-auto px-[clamp(16px,5vw,56px)] py-14 md:py-20">
      {!item.active && (
        <p className="mb-6 inline-block text-[0.78rem] font-semibold text-danger border border-danger/40 bg-danger/10 rounded-full px-3 py-1">
          Hidden from shop — visible to admins only
        </p>
      )}
      <div className="grid md:grid-cols-2 gap-12">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full rounded-2xl border border-line object-cover aspect-[4/3]"
          />
        ) : (
          <div className="aspect-[4/3] grid place-items-center text-accent font-serif text-3xl rounded-2xl border border-line bg-gradient-to-br from-[#1c2130] to-[#0f121b]">
            {item.name.split(" ")[0]}
          </div>
        )}

        <div>
          <h1 className="text-[2rem] mb-3">{item.name}</h1>
          <p className="text-accent text-[1.3rem] font-semibold mb-5">{formatCents(item.priceCents)}</p>
          {item.note && <p className="text-muted text-[0.9rem] mb-6">{item.note} • COA included</p>}
          <p className="text-muted leading-relaxed whitespace-pre-line mb-8">{item.description}</p>

          <AddToCartButton
            itemId={item.id}
            isSignedIn={!!session?.user}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-[0.95rem] bg-gradient-to-br from-accent to-accent-2 text-accent-ink shadow-[0_10px_30px_-10px_var(--accent-glow)] hover:-translate-y-0.5 transition-transform"
          />
        </div>
      </div>
    </div>
  );
}
