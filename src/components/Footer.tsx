import Link from "next/link";

const linkClass = "block text-[0.9rem] py-1.5 hover:text-accent transition-colors";
const headingClass = "font-sans text-[0.76rem] uppercase tracking-[0.14em] text-muted mb-3.5";

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-line mt-8">
      {/* Full-width, same side padding as the header so columns span edge to edge */}
      <div className="px-[clamp(16px,5vw,56px)] pt-[72px] pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 mb-11">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="uppercase tracking-[0.08em] text-[1.15rem]">
              <span className="font-extrabold">Vital</span>{" "}
              <span className="font-normal text-accent">Aminos</span>
            </Link>
            <p className="text-muted text-[0.85rem] mt-3 max-w-[32ch]">
              High-purity research peptides with batch-specific COAs. For research use only.
            </p>
          </div>
          <div>
            <h4 className={headingClass}>Shop</h4>
            <Link href="/compounds" className={linkClass}>All compounds</Link>
            <Link href="/coas" className={linkClass}>COA library</Link>
            <Link href="/search" className={linkClass}>Search</Link>
          </div>
          <div>
            <h4 className={headingClass}>Support</h4>
            <Link href="/contact" className={linkClass}>Contact</Link>
            <Link href="/orders" className={linkClass}>Order history</Link>
            <Link href="/about" className={linkClass}>About us</Link>
          </div>
          <div>
            <h4 className={headingClass}>Policies</h4>
            <a href="#" className={linkClass}>Research use policy</a>
            <a href="#" className={linkClass}>Terms of sale</a>
            <a href="#" className={linkClass}>Privacy</a>
          </div>
        </div>
        <p className="text-muted text-[0.8rem] border-t border-line pt-6">
          Products offered by Vital Aminos are sold strictly for research, laboratory, or
          analytical purposes only. They are not intended for human consumption, animal
          consumption, medical use, diagnostic use, therapeutic use, or any use that violates
          applicable laws or regulations.
        </p>
        <p className="text-muted text-[0.78rem] mt-4">
          © {new Date().getFullYear()} Vital Aminos. For Research Use Only.
        </p>
      </div>
    </footer>
  );
}
