import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact" className="max-w-[1140px] mx-auto px-[clamp(16px,5vw,56px)] pt-[72px] pb-12">
      <div className="flex gap-16 flex-wrap mb-11">
        <div>
          <h4 className="font-sans text-[0.76rem] uppercase tracking-[0.14em] text-muted mb-3.5">Shop</h4>
          <Link href="/#shop" className="block text-[0.9rem] py-1.5 hover:text-accent transition-colors">All peptides</Link>
          <Link href="/#coa" className="block text-[0.9rem] py-1.5 hover:text-accent transition-colors">COA library</Link>
        </div>
        <div>
          <h4 className="font-sans text-[0.76rem] uppercase tracking-[0.14em] text-muted mb-3.5">Support</h4>
          <Link href="/#contact" className="block text-[0.9rem] py-1.5 hover:text-accent transition-colors">Contact</Link>
          <Link href="/orders" className="block text-[0.9rem] py-1.5 hover:text-accent transition-colors">Order history</Link>
        </div>
        <div>
          <h4 className="font-sans text-[0.76rem] uppercase tracking-[0.14em] text-muted mb-3.5">Policies</h4>
          <a href="#" className="block text-[0.9rem] py-1.5 hover:text-accent transition-colors">Research use policy</a>
          <a href="#" className="block text-[0.9rem] py-1.5 hover:text-accent transition-colors">Terms of sale</a>
          <a href="#" className="block text-[0.9rem] py-1.5 hover:text-accent transition-colors">Privacy</a>
        </div>
      </div>
      <p className="text-muted text-[0.8rem] border-t border-line pt-6 max-w-[90ch]">
        Products offered by Vital Aminos are sold strictly for research, laboratory, or
        analytical purposes only. They are not intended for human consumption, animal
        consumption, medical use, diagnostic use, therapeutic use, or any use that violates
        applicable laws or regulations.
      </p>
      <p className="text-muted text-[0.78rem] mt-4">
        © {new Date().getFullYear()} Vital Aminos. For Research Use Only.
      </p>
    </footer>
  );
}
