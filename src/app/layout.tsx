import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import AccessGate from "@/components/AccessGate";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Vital Aminos — High-Purity Research Peptides",
  description:
    "High-purity research peptides for laboratory use only. COA included. For research use only — not for human or veterinary use.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
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
