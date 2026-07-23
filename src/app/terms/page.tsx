import Link from "next/link";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { CtaBanner } from "@/components/shared/cta-banner";

export const metadata = buildMetadata({
  title: "Terms of Use",
  description: `Terms of use template for ${siteConfig.legalName}. Review with an attorney before relying on this language.`,
  path: "/terms",
  noIndex: true,
});

const sections = [
  {
    title: "1. Agreement",
    body: `By accessing ${siteConfig.url}, you agree to these Terms of Use. If you do not agree, do not use the site. This document is a template for attorney review — not formal legal advice.`,
  },
  {
    title: "2. Who we are",
    body: `${siteConfig.legalName} provides real estate information and brokerage services in California. ${siteConfig.name} is a licensed California REALTOR® (${siteConfig.license.dre}). Brokerage affiliation and office details should be confirmed on listing materials and disclosures.`,
  },
  {
    title: "3. Informational content only",
    body: "Market reports, calculators, blog posts, valuations, and neighborhood summaries are for general information. They are not appraisals, guarantees of value, financial advice, or legal advice. Always verify critical facts independently and with licensed professionals.",
  },
  {
    title: "4. MLS & listing accuracy",
    body: "Listing data may come from third-party MLS or data providers and can be incomplete, delayed, or incorrect. Properties may be sold, withdrawn, or change price without notice. Confirm status and details before making decisions.",
  },
  {
    title: "5. No brokerage relationship by browsing",
    body: "Using this website alone does not create an agency, fiduciary, or brokerage relationship. A relationship begins only under a written agreement or as otherwise required by California law.",
  },
  {
    title: "6. User conduct",
    body: "You agree not to misuse the site, attempt unauthorized access, scrape content in violation of applicable terms, submit unlawful content, or interfere with site operations.",
  },
  {
    title: "7. Intellectual property",
    body: "Site design, branding, and original content are owned by us or our licensors. You may not copy or redistribute materials except as allowed by law or with written permission. Third-party trademarks remain the property of their owners.",
  },
  {
    title: "8. Third-party links & embeds",
    body: "Calendly, maps, social networks, and other embeds are governed by their own terms. We are not responsible for third-party sites or services.",
  },
  {
    title: "9. Disclaimer of warranties",
    body: 'THE SITE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, TO THE FULLEST EXTENT PERMITTED BY LAW.',
  },
  {
    title: "10. Limitation of liability",
    body: "To the fullest extent permitted by law, we are not liable for indirect, incidental, special, consequential, or punitive damages arising from use of the site or reliance on its content.",
  },
  {
    title: "11. Indemnity",
    body: "You agree to indemnify and hold harmless Jason Lim Real Estate and related parties from claims arising out of your misuse of the site or violation of these terms.",
  },
  {
    title: "12. Governing law",
    body: "These terms are governed by the laws of the State of California, without regard to conflict-of-law principles. Venue for disputes should be confirmed with counsel (typically Santa Clara County or as agreed in writing).",
  },
  {
    title: "13. Changes",
    body: "We may update these terms periodically. Continued use after changes constitutes acceptance of the revised terms.",
  },
  {
    title: "14. Contact",
    body: `${siteConfig.contact.email} · ${siteConfig.contact.phone} · ${siteConfig.contact.address.city}, ${siteConfig.contact.address.state}.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        description="Website terms template. Customize with counsel before treating this as binding."
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-warning/30 bg-warning/10 px-5 py-4 text-sm text-foreground">
          <p className="font-medium">Attorney review required</p>
          <p className="text-muted-foreground">
            This page is a <strong>placeholder template</strong> only. It is not legal advice.
            Have an attorney review brokerage disclosures, MLS compliance, and liability language
            before go-live.
          </p>
          <p className="text-xs text-muted-foreground">Last updated: July 23, 2026 (template)</p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-10">
          {sections.map((section) => (
            <article key={section.title} className="space-y-3">
              <h2 className="font-display text-2xl font-semibold tracking-tight">
                {section.title}
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground text-pretty">
                {section.body}
              </p>
            </article>
          ))}
          <p className="text-sm text-muted-foreground">
            Related:{" "}
            <Link href="/privacy" className="font-medium text-accent hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </Section>

      <CtaBanner
        title="Looking for real estate help?"
        description="These terms cover the website — for buying or selling, let's talk strategy."
      />
    </>
  );
}
