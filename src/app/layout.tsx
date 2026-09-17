import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import AccessGate from "@/components/AccessGate";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Vital Aminos — High-Purity Research Peptides",
  description:
    "High-purity research peptides for laboratory use only. COA included. For research use only — not for human or veterinary use.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-text">
        <AccessGate>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AccessGate>
      </body>
    </html>
  );
}
