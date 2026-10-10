import Link from "next/link";
import { auth, signOut } from "@/auth";
import CartBadge from "@/components/CartBadge";
import { getDiscount } from "@/lib/settings";
import MobileMenu from "@/components/MobileMenu";
import SearchBar from "@/components/SearchBar";

export default async function Header() {
  const [session, discount] = await Promise.all([auth(), getDiscount()]);

  // Members-only site: signed-out visitors only ever see the sign-in page, so
  // show a bare brand bar with no navigation, search, cart or promo details.
  if (!session?.user) {
    return (
      <header className="flex items-center justify-center py-[18px] px-[clamp(16px,5vw,56px)] border-b border-line bg-bg">
        <span className="uppercase tracking-[0.08em] text-[1.15rem]">
          <span className="font-extrabold">Vital</span>{" "}
          <span className="font-normal text-accent">Aminos</span>
        </span>
      </header>
    );
  }

  const links = [
    { href: "/", label: "Home" },
    { href: "/compounds", label: "Compounds", hint: "Browse research peptides" },
    { href: "/coas", label: "COAs", hint: "Certificates of analysis" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    ...(session?.user ? [{ href: "/orders", label: "My orders" }] : []),
    ...(session?.user?.isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <>
      <div className="bg-gradient-to-r from-accent-soft to-[rgba(29,111,232,0.14)] border-b border-line text-text text-[0.78rem] tracking-[0.01em] flex gap-3 justify-center items-center py-2.5 px-4">
        <span>Free shipping on orders $150+</span>
        {discount.enabled && (
          <>
            <span className="opacity-40">•</span>
            <span>
              <strong className="text-accent">{discount.percent}% off</strong> sitewide — prices
              already reduced
            </span>
          </>
        )}
      </div>

      <header className="flex items-center justify-between gap-6 py-[18px] px-[clamp(16px,5vw,56px)] border-b border-line sticky top-0 bg-[rgba(4,8,15,0.78)] backdrop-blur-xl z-40">
        <Link href="/" className="flex items-center gap-3 uppercase tracking-[0.08em] text-[1.15rem]">
          {/* LOGO PLACEHOLDER — swap this box for <Image src="/logo.svg" width={40} height={40} alt="Vital Aminos" /> */}
          <span
            aria-label="Logo placeholder"
            className="grid place-items-center w-10 h-10 rounded-xl border border-dashed border-line-strong text-[0.55rem] font-sans font-bold tracking-widest text-muted"
          >
            LOGO
          </span>
          <span>
            <span className="font-extrabold">Vital</span>{" "}
            <span className="font-normal text-accent">Aminos</span>
          </span>
        </Link>

        <SearchBar className="hidden md:block flex-1 max-w-[380px]" />

        <div className="flex items-center gap-3">
          <Link href="/search" aria-label="Search" className="md:hidden grid place-items-center w-10 h-10 rounded-xl border border-line-strong hover:border-accent">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          </Link>
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
          <MobileMenu links={links} isSignedIn={!!session?.user} />
        </div>
      </header>
    </>
  );
}
