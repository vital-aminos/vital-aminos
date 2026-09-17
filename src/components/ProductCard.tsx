import Link from "next/link";
import { formatCents } from "@/lib/money";
import AddToCartButton from "@/components/AddToCartButton";

export type ProductCardItem = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  note?: string | null;
  imageUrl?: string | null;
};

export default function ProductCard({
  item,
  isSignedIn,
}: {
  item: ProductCardItem;
  isSignedIn: boolean;
}) {
  const initials = item.name.split(" ")[0];

  return (
    <article className="bg-gradient-to-b from-panel-2 to-panel border border-line rounded-2xl overflow-hidden flex flex-col shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-1.5 hover:border-accent hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.55),0_0_0_1px_var(--accent-soft)]">
      <Link href={`/item/${item.slug}`} className="block">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className="aspect-[4/3] w-full object-cover border-b border-line"
          />
        ) : (
          <div className="aspect-[4/3] grid place-items-center text-accent font-serif text-2xl border-b border-line bg-gradient-to-br from-[#1c2130] to-[#0f121b]">
            {initials}
          </div>
        )}
      </Link>
      <div className="p-5 flex flex-col gap-1.5 flex-1">
        <Link href={`/item/${item.slug}`} className="font-semibold text-[1rem] hover:text-accent transition-colors">
          {item.name}
        </Link>
        <span className="text-accent text-[0.95rem] font-semibold">{formatCents(item.priceCents)}</span>
        {item.note && <span className="text-muted text-[0.8rem] mb-3.5">{item.note} • COA included</span>}
        <AddToCartButton itemId={item.id} isSignedIn={isSignedIn} />
      </div>
    </article>
  );
}
