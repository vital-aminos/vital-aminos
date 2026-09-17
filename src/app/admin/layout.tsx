import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

// Admin data is always fresh, per-request, and gated by a live session —
// never attempt to prerender it at build time.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="max-w-[1000px] mx-auto px-[clamp(16px,5vw,56px)] py-12">
      <div className="flex items-center gap-6 mb-10 border-b border-line pb-5">
        <Link href="/admin" className="font-serif text-[1.3rem]">
          Admin
        </Link>
        <nav className="flex gap-5 text-[0.88rem] text-muted">
          <Link href="/admin" className="hover:text-text transition-colors">Items</Link>
          <Link href="/admin/items/new" className="hover:text-text transition-colors">Add item</Link>
        </nav>
        <Link href="/" className="ml-auto text-[0.85rem] text-muted hover:text-accent transition-colors">
          ← Back to site
        </Link>
      </div>
      {children}
    </div>
  );
}
