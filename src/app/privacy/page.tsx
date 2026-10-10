import type { Metadata } from "next";
import Link from "next/link";
import { PAGE_WRAP } from "@/lib/catalog";

export const metadata: Metadata = { title: "Privacy Policy — Vital Aminos" };

const LAST_UPDATED = "October 10, 2026";

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10 scroll-mt-28">
      <h2 className="text-[1.3rem] mb-3">{title}</h2>
      <div className="text-muted text-[0.95rem] leading-relaxed flex flex-col gap-3">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className={`${PAGE_WRAP} py-14 md:py-20`}>
      <div className="max-w-[72ch]">
        <p className="inline-block uppercase tracking-[0.22em] text-[0.68rem] text-accent mb-3 font-bold">
          Legal
        </p>
        <h1 className="text-[clamp(1.9rem,4vw,2.6rem)] mb-2">Privacy Policy</h1>
        <p className="text-muted text-[0.85rem] mb-10">Last updated: {LAST_UPDATED}</p>

        <Section title="Who we are">
          <p>
            Vital Aminos (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates this website and sells
            research materials strictly for laboratory use. This policy explains what personal
            information we collect, why, and the choices you have. By using the site you
            acknowledge this policy.
          </p>
        </Section>

        <Section title="Information we collect">
          <p>
            <strong className="text-text">Account information.</strong> When you sign in with
            Google we receive your name, email address and profile picture. We don&apos;t receive
            or store your Google password.
          </p>
          <p>
            <strong className="text-text">Order information.</strong> The items, quantities,
            prices and totals of orders you place, and the date of each order.
          </p>
          <p>
            <strong className="text-text">Messages.</strong> Your name, email address and message
            when you contact us through the contact form.
          </p>
          <p>
            <strong className="text-text">Eligibility confirmation.</strong> The research role you
            select and your confirmation that you are 21 or older and a qualified researcher. This
            is stored in your browser only and, if you choose &ldquo;Remember me&rdquo;, for 5
            days.
          </p>
          <p>
            <strong className="text-text">Technical data.</strong> Like most websites, our hosting
            and infrastructure providers may automatically log your IP address, browser type,
            device information and the pages requested, for security and reliability.
          </p>
        </Section>

        <Section title="How we use information">
          <ul className="list-disc pl-5 flex flex-col gap-1.5">
            <li>To authenticate you and operate your account.</li>
            <li>To process, fulfil and keep a record of your orders.</li>
            <li>To respond to your messages and provide support.</li>
            <li>To verify eligibility for research-use-only products.</li>
            <li>To secure the site, prevent abuse and meet legal obligations.</li>
          </ul>
          <p>We do not sell your personal information or share it for advertising.</p>
        </Section>

        <Section id="cookies" title="Cookies and local storage">
          <p>
            We use only <strong className="text-text">essential</strong> cookies and browser
            storage. They are required for the site to work and are not used for tracking or
            advertising:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[0.85rem] border border-line rounded-xl overflow-hidden">
              <thead className="bg-panel-2 text-text">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Name</th>
                  <th className="px-4 py-2.5 font-semibold">Purpose</th>
                  <th className="px-4 py-2.5 font-semibold">Lifetime</th>
                </tr>
              </thead>
              <tbody className="[&_td]:px-4 [&_td]:py-2.5 [&_tr]:border-t [&_tr]:border-line">
                <tr>
                  <td>authjs.session-token</td>
                  <td>Keeps you signed in (cookie)</td>
                  <td>Until sign-out / session expiry</td>
                </tr>
                <tr>
                  <td>authjs.csrf-token, authjs.callback-url</td>
                  <td>Sign-in security and redirect (cookies)</td>
                  <td>Session</td>
                </tr>
                <tr>
                  <td>va_access_grant</td>
                  <td>Remembers your research-use confirmation (local storage)</td>
                  <td>5 days, only if you choose it</td>
                </tr>
                <tr>
                  <td>va_cart</td>
                  <td>Your shopping cart (local storage)</td>
                  <td>Until cleared or order placed</td>
                </tr>
                <tr>
                  <td>va_cookie_notice</td>
                  <td>Remembers that you saw the cookie notice (local storage)</td>
                  <td>Until cleared</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            You can clear cookies and site data in your browser settings at any time; doing so
            will sign you out and empty your cart. If we later add analytics or other
            non-essential cookies, we will ask for your consent first.
          </p>
        </Section>

        <Section title="Who we share information with">
          <p>
            We share information only with service providers that help us run the site, under
            their own privacy terms: Google (sign-in), our database provider and our hosting
            provider. We may also disclose information if required by law or to protect our
            rights, users or the public.
          </p>
        </Section>

        <Section title="Retention and security">
          <p>
            We keep account and order information for as long as your account is active and as
            needed for record-keeping and legal obligations, then delete or anonymise it. We use
            reasonable technical measures to protect your information, but no online service can
            guarantee absolute security.
          </p>
        </Section>

        <Section title="Your choices and rights">
          <p>
            You can ask us to access, correct or delete the personal information we hold about
            you, or object to certain processing. Depending on where you live (for example under
            the GDPR or the California Consumer Privacy Act) you may have additional rights. To
            make a request, reach us through the{" "}
            <Link href="/contact" className="text-accent hover:underline">
              contact page
            </Link>
            . We will respond within the time required by applicable law.
          </p>
        </Section>

        <Section title="Eligibility and children">
          <p>
            This site is intended only for qualified research customers aged 21 or older. We do
            not knowingly collect personal information from anyone under 21. If you believe a
            minor has provided us information, contact us and we will delete it.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this policy from time to time. The &ldquo;Last updated&rdquo; date
            above shows when it last changed; material changes will be highlighted on the site.
          </p>
        </Section>

        <p className="text-muted text-[0.8rem] border-t border-line pt-6">
          Questions about this policy?{" "}
          <Link href="/contact" className="text-accent hover:underline">
            Contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
