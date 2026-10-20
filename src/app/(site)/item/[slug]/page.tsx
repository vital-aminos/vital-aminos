import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ProductPurchase from "@/components/ProductPurchase";
import ProductCard from "@/components/ProductCard";
import { readStrengths } from "@/lib/product-options";
import { getDiscount } from "@/lib/settings";


export const dynamic = "force-dynamic";

export default async function ItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [session, item, discount] = await Promise.all([
    auth(),
    prisma.item.findUnique({ where: { slug } }),
    getDiscount(),
  ]);

  // Full product details are for signed-in visitors only.
  if (!session?.user) redirect(`/sign-in?callbackUrl=${encodeURIComponent(`/item/${slug}`)}`);

  if (!item || (!item.active && !session?.user?.isAdmin)) notFound();

  const similar = item.category ? await prisma.item.findMany({
    where: { active: true, id: { not: item.id }, category: { equals: item.category, mode: "insensitive" } },
    orderBy: { createdAt: "desc" }, take: 3,
  }) : [];

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
            className="w-full rounded-2xl border border-line object-contain p-6 bg-gradient-to-b from-[#0f1c33] to-[#07101e] aspect-[4/3]"
          />
        ) : (
          <div className="aspect-[4/3] grid place-items-center text-accent font-serif text-3xl rounded-2xl border border-line bg-gradient-to-br from-[#0f1c33] to-[#07101e]">
            {item.name.split(" ")[0]}
          </div>
        )}

        <div>
          <h1 className="text-[2rem] mb-3">{item.name}</h1>
          {item.category && <p className="text-accent text-sm mb-4">{item.category}</p>}
          {item.note && <p className="text-muted text-[0.9rem] mb-6">{item.note} • COA included</p>}
          <p className="text-muted leading-relaxed whitespace-pre-line mb-8">{item.description}</p>

          <ProductPurchase itemId={item.id} priceCents={item.priceCents} strengths={readStrengths(item.strengths)} discountPercent={discount.percent} active={item.active} />
        </div>
      </div>
      {similar.length > 0 && (
        <section className="mt-16 pt-10 border-t border-line" aria-labelledby="similar-title">
          <h2 id="similar-title" className="text-2xl mb-3">Similar products</h2>
          <p className="text-muted text-sm mb-7">More from {item.category}.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similar.map(product => <ProductCard key={product.id} item={product} isSignedIn discountPercent={discount.percent} />)}
          </div>
        </section>
      )}
    </div>
  );
}
