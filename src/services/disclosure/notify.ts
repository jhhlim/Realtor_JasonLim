import { siteConfig } from "@/config/site";
import type { DisclosureDraft } from "@/lib/disclosure/schema";

function resolveToAddress() {
  return (
    process.env.CONTACT_TO_EMAIL?.trim() ||
    siteConfig.contact.email ||
    "jason.lim@compass.com"
  );
}

/** Notify Jason that a package arrived — never attach PDFs or paste full document text. */
export async function notifyDisclosureReceived(input: {
  requestId: string;
  fullName: string;
  email: string;
  phone?: string;
  preferredContact: string;
  propertyAddress: string;
  fileNames: string[];
  status: string;
  draft?: DisclosureDraft | null;
  unreadableCount: number;
}) {
  const to = resolveToAddress();
  const subject = `Disclosure package from ${input.fullName} — ${input.propertyAddress}`;

  const overview = input.draft?.overview
    ? input.draft.overview.slice(0, 800)
    : "AI draft not available yet — open the private request record / storage paths in Supabase.";

  const findings = (input.draft?.importantFindings ?? [])
    .slice(0, 5)
    .map(
      (f, i) =>
        `${i + 1}. [${f.topic}] ${f.summary} (${f.sourceDocument}, p.${f.sourcePage})`,
    )
    .join("\n");

  const text = [
    `New disclosure review request`,
    `Request ID: ${input.requestId}`,
    `Status: ${input.status}`,
    `Name: ${input.fullName}`,
    `Email: ${input.email}`,
    input.phone ? `Phone: ${input.phone}` : null,
    `Preferred contact: ${input.preferredContact}`,
    `Property: ${input.propertyAddress}`,
    `Files: ${input.fileNames.join("; ")}`,
    `Unreadable pages flagged: ${input.unreadableCount}`,
    "",
    "Draft overview (for your review before sharing):",
    overview,
    findings ? `\nTop findings:\n${findings}` : null,
    "",
    "PDFs are stored privately in Supabase Storage (disclosure-packages). Do not forward document contents by email.",
    "Review the draft in the disclosure_requests.draft_report column before contacting the buyer.",
  ]
    .filter(Boolean)
    .join("\n");

  // Prefer FormSubmit (no domain verification). Avoid logging document text.
  if (process.env.FORMSUBMIT_DISABLED !== "1") {
    try {
      const res = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(to)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: input.fullName,
            email: input.email,
            phone: input.phone || "",
            source: "disclosure-review-upload",
            message: text,
            _subject: subject,
            _template: "table",
            _captcha: "false",
          }),
        },
      );
      if (res.ok) return { sent: true as const, provider: "formsubmit" as const };
    } catch {
      // fall through
    }
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (apiKey) {
    const from =
      process.env.EMAIL_FROM?.trim() || "Jason Lim <onboarding@resend.dev>";
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: input.email,
          subject,
          text,
        }),
      });
      if (res.ok) return { sent: true as const, provider: "resend" as const };
    } catch {
      // fall through
    }
  }

  console.info("[disclosure-notify] email not sent; request stored", {
    requestId: input.requestId,
    to,
  });
  return { sent: false as const };
}
