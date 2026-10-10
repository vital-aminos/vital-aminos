import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact Us — Vital Aminos" };

export default function ContactPage() {
  return (
    <div className="max-w-[640px] mx-auto px-6 py-14 md:py-20">
      <p className="inline-block uppercase tracking-[0.22em] text-[0.68rem] text-accent mb-3 font-bold">
        Support
      </p>
      <h1 className="text-[2rem] mb-3">Contact us</h1>
      <p className="text-muted mb-9">
        Questions about a batch, COA, or an order? Send us a note and we&apos;ll get back to you by
        email. We can&apos;t provide dosing or medical guidance — products are for research use only.
      </p>
      <ContactForm />
    </div>
  );
}
