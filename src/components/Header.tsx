import Link from "next/link";
import { auth, signOut } from "@/auth";
import CartBadge from "@/components/CartBadge";

export default async function Header() {
  const session = await auth();

  return (
    <>
      <div className="bg-gradient-to-r from-accent-soft to-[rgba(129,140,248,0.1)] border-b border-line text-text text-[0.78rem] tracking-[0.01em] flex gap-3 justify-center items-center py-2.5 px-4">
        <span>Free shipping on orders $150+</span>
        <span className="opacity-40">•</span>
        <span>
          Use code <strong className="text-accent">VA15</strong> for 15% off
        </span>
      </div>

      <header className="flex items-center justify-between gap-6 py-[18px] px-[clamp(16px,5vw,56px)] border-b border-line sticky top-0 bg-[rgba(9,11,16,0.72)] backdrop-blur-xl z-40">
        <Link href="/" className="font-serif font-semibold text-[1.22rem]">
          Vital{" "}
          <span className="bg-gradient-to-br from-accent to-accent-2 bg-clip-text text-transparent">
            Aminos
          </span>
        </Link>

        <nav className="hidden md:flex gap-8 text-[0.9rem] text-muted">
          <Link href="/#shop" className="hover:text-text transition-colors">Shop</Link>
          <Link href="/#coa" className="hover:text-text transition-colors">COA</Link>
          <Link href="/#about" className="hover:text-text transition-colors">About Us</Link>
          {session?.user && (
            <Link href="/orders" className="hover:text-text transition-colors">My orders</Link>
          )}
          {session?.user?.isAdmin && (
            <Link href="/admin" className="text-accent hover:text-text transition-colors">Admin</Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <CartBadge />
          {session?.user ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <div className="flex items-center gap-3">
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? "Account"}
                    className="w-8 h-8 rounded-full border border-line-strong"
                    referrerPolicy="no-referrer"
                  />
                ) : null}
                <button
                  type="submit"
                  className="text-[0.85rem] text-muted hover:text-text transition-colors"
                >
                  Sign out
                </button>
              </div>
            </form>
          ) : (
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-[0.88rem] bg-gradient-to-br from-accent to-accent-2 text-accent-ink shadow-[0_10px_30px_-10px_var(--accent-glow)] hover:-translate-y-0.5 transition-transform"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>
    </>
  );
}
