import Link from "next/link";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { CtaBanner } from "@/components/shared/cta-banner";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: `Privacy policy template for ${siteConfig.legalName}. Review with an attorney before relying on this language.`,
  path: "/privacy",
  noIndex: true,
});

const sections = [
  {
    title: "1. Overview",
    body: `This Privacy Policy template describes how ${siteConfig.legalName} ("we", "us") may collect, use, and share information when you visit ${siteConfig.url}, contact us, subscribe to updates, or use our tools. It is a placeholder for legal review — not formal legal advice.`,
  },
  {
    title: "2. Information we may collect",
    body: "Contact details (name, email, phone), inquiry content, newsletter preferences, property or search preferences you share, device/browser data, and analytics events from cookies or similar technologies when enabled.",
  },
  {
    title: "3. How we use information",
    body: "To respond to inquiries, schedule consultations, provide market updates, improve the website, measure marketing performance, and comply with legal obligations. We do not sell personal information as that term is commonly understood under California law, but advertising/analytics partners may process data as described once configured.",
  },
  {
    title: "4. Sharing",
    body: "Service providers (hosting, email, CRM, analytics, scheduling) may process data on our behalf. We may disclose information if required by law or to protect rights and safety. MLS and transaction partners may receive information necessary to facilitate a real estate transaction.",
  },
  {
    title: "5. Cookies & analytics",
    body: "We may use cookies, pixels, and analytics tools (for example Google Analytics, Meta Pixel, or similar) when those integrations are enabled via environment configuration. You can control cookies through your browser settings.",
  },
  {
    title: "6. Your choices (California & others)",
    body: "Depending on your location, you may have rights to access, correct, delete, or limit certain processing of personal information. Contact us using the details below to make a request. We will verify and respond as required by applicable law.",
  },
  {
    title: "7. Data retention & security",
    body: "We retain information as needed for business, legal, and transaction purposes. We use reasonable administrative and technical safeguards; no method of transmission is 100% secure.",
  },
  {
    title: "8. Children's privacy",
    body: "This site is not directed to children under 16. We do not knowingly collect personal information from children.",
  },
  {
    title: "9. Changes",
    body: "We may update this policy from time to time. The “Last updated” date will change when material revisions are posted.",
  },
  {
    title: "10. Contact",
    body: `Questions about privacy: ${siteConfig.contact.email} · ${siteConfig.contact.phone} · ${siteConfig.contact.address.city}, ${siteConfig.contact.address.state}.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="Template language for website visitors. Have qualified counsel review and customize before publishing as binding policy."
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-warning/30 bg-warning/10 px-5 py-4 text-sm text-foreground">
          <p className="font-medium">Attorney review required</p>
          <p className="text-muted-foreground">
            This page is a <strong>placeholder template</strong> only. It is not legal advice
            and should not be relied on as a complete California or federal privacy notice.
            Replace with counsel-approved language before go-live.
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
            See also{" "}
            <Link href="/terms" className="font-medium text-accent hover:underline">
              Terms of Use
            </Link>
            .
          </p>
        </div>
      </Section>

      <CtaBanner
        title="Questions about your data?"
        description="Reach out anytime — happy to explain how inquiry information is handled."
        secondaryLabel="Contact"
        secondaryHref="/contact"
      />
    </>
  );
}
