import type { Metadata } from "next";
import Link from "next/link";
import { PAGE_WRAP } from "@/lib/catalog";

export const metadata: Metadata = { title: "About Us — Vital Aminos" };

export default function AboutPage() {
  return (
    <div className={`${PAGE_WRAP} py-14 md:py-20`}>
      <div className="max-w-[60ch] mb-8">
        <h1 className="text-[clamp(1.9rem,4vw,2.6rem)]">About Vital Aminos</h1>
      </div>
      <p className="text-muted max-w-[70ch] text-[1.02rem] mb-8">
        Vital Aminos supplies research-grade peptides to principal investigators, academic faculty,
        and independent researchers. We do not provide dosing guidance, medical advice, or support
        for any use in humans or animals. All materials are intended for controlled laboratory
        environments and handling by trained professionals.
      </p>
      <Link href="/contact" className="text-accent hover:underline">
        Questions? Contact us →
      </Link>
    </div>
  );
}
