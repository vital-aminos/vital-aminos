import type { Metadata } from "next";
import Link from "next/link";
import { PAGE_WRAP } from "@/lib/catalog";

export const metadata: Metadata = { title: "Terms of Sale — Vital Aminos" };

export default function TermsPage() {
  return (
    <article className={`${PAGE_WRAP} py-14 md:py-20`}>
      <div className="max-w-[72ch] space-y-8">
        <h1 className="text-3xl text-white">Terms of sale</h1>
        <section className="space-y-3">
          <h2 className="text-xl">Research customers and permitted use</h2>
          <p className="text-muted">Vital Aminos supplies research compounds to qualified researchers aged 21 or older. Products are for laboratory and analytical research only, and are not for human or veterinary use. Read our <Link href="/research-use" className="text-accent hover:underline">research use policy</Link> before ordering.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl">Products, strengths and prices</h2>
          <p className="text-muted">Prices are shown in USD. Select the required strength and quantity before placing an order. Available discounts are reflected in the displayed price. The cart checks current prices and availability when an order is placed; out-of-stock items cannot be ordered.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl">Current ordering and payment process</h2>
          <p className="text-muted">This website currently records orders as awaiting payment. Placing an order does not charge your payment method. Review your order history for the recorded products, strengths, quantities and total. Contact us to confirm payment and fulfillment arrangements before sending payment.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl">Shipping, changes and product issues</h2>
          <p className="text-muted">Contact us about shipping arrangements, order changes, cancellations, returns, or a problem with a delivery. Include the order number shown in your order history so we can locate the order. Confirm applicable arrangements with us before completing payment.</p>
        </section>
        <p><Link href="/contact" className="text-accent hover:underline">Contact support</Link><span className="text-muted"> · </span><Link href="/orders" className="text-accent hover:underline">Order history</Link><span className="text-muted"> · </span><Link href="/privacy" className="text-accent hover:underline">Privacy policy</Link></p>
      </div>
    </article>
  );
}
