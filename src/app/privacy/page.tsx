import Link from "next/link";

import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { CtaBanner } from "@/components/shared/cta-banner";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.legalName}.`,
  path: "/privacy",
});

const lastUpdated = "July 31, 2026";

const sections = [
  {
    title: "1. Overview",
    body: `This Privacy Policy describes how ${siteConfig.legalName} ("we", "us") collects, uses, and shares information when you visit ${siteConfig.url}, contact us, subscribe to updates, or use our tools.`,
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
    body: `Questions about privacy: ${siteConfig.contact.email} · ${siteConfig.contact.phone} · ${siteConfig.contact.address.city}, ${siteConfig.contact.address.state} ${siteConfig.contact.address.zip}.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description={`How ${siteConfig.name} handles information you share on this site.`}
      />

      <Section>
        <div className="mx-auto max-w-3xl space-y-10">
          <p className="text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
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
