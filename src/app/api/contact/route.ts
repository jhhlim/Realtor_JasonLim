import { NextResponse } from "next/server";
import { z } from "zod";

import { siteConfig } from "@/config/site";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Valid email is required"),
  phone: z.string().max(40).optional().or(z.literal("")),
  message: z.string().min(1, "Message is required").max(5000),
  interest: z
    .enum(["buy", "sell", "invest", "rent", "other"])
    .optional()
    .default("other"),
  listingId: z.string().optional(),
  listingUrl: z.string().url().optional().or(z.literal("")),
  preferredCities: z.array(z.string()).optional(),
  source: z.string().optional(),
  notifyEmail: z.string().email().optional(),
});

function resolveFromAddress() {
  return (
    process.env.EMAIL_FROM?.trim() ||
    "Jason Lim <onboarding@resend.dev>"
  );
}

function resolveToAddress(override?: string) {
  return (
    override ||
    process.env.CONTACT_TO_EMAIL?.trim() ||
    siteConfig.contact.email ||
    "jason.lim@compass.com"
  );
}

type SendResult =
  | { sent: true; provider: "resend" | "formsubmit"; id?: string }
  | { sent: false; provider?: string; reason: string; status?: number; detail?: string };

function isResendDomainRestriction(detail?: string) {
  if (!detail) return false;
  const lower = detail.toLowerCase();
  return (
    lower.includes("verify a domain") ||
    lower.includes("own email address") ||
    lower.includes("testing emails") ||
    lower.includes("domain is not verified")
  );
}

async function sendWithResend(input: {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { sent: false, provider: "resend", reason: "missing_resend_key" };
  }

  const from = resolveFromAddress();

  let res: Response;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        reply_to: input.replyTo,
        subject: input.subject,
        text: input.text,
        html: input.html,
      }),
    });
  } catch (error) {
    console.error("[api/contact] Resend network error", error);
    return { sent: false, provider: "resend", reason: "network_error" };
  }

  const raw = await res.text().catch(() => "");
  let parsed: { id?: string; message?: string } | null = null;
  try {
    parsed = raw ? (JSON.parse(raw) as { id?: string; message?: string }) : null;
  } catch {
    parsed = null;
  }

  if (!res.ok) {
    console.error("[api/contact] Resend error", res.status, raw);
    return {
      sent: false,
      provider: "resend",
      reason: "resend_failed",
      status: res.status,
      detail: parsed?.message || raw.slice(0, 500) || `HTTP ${res.status}`,
    };
  }

  return { sent: true, provider: "resend", id: parsed?.id };
}

/**
 * Domain-free fallback. First submission emails an activation link to `to`.
 * After Jason clicks Activate, subsequent leads deliver normally.
 * https://formsubmit.co/
 */
async function sendWithFormSubmit(input: {
  to: string;
  replyTo: string;
  subject: string;
  name: string;
  phone?: string;
  interest: string;
  source?: string;
  message: string;
}): Promise<SendResult> {
  // Allow disabling via env if needed.
  if (process.env.FORMSUBMIT_DISABLED === "1") {
    return { sent: false, provider: "formsubmit", reason: "disabled" };
  }

  let res: Response;
  try {
    res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(input.to)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: input.name,
        email: input.replyTo,
        phone: input.phone || "",
        interest: input.interest,
        source: input.source || "",
        message: input.message,
        _subject: input.subject,
        _template: "table",
        _captcha: "false",
      }),
    });
  } catch (error) {
    console.error("[api/contact] FormSubmit network error", error);
    return { sent: false, provider: "formsubmit", reason: "network_error" };
  }

  const raw = await res.text().catch(() => "");
  let parsed: { success?: string | boolean; message?: string } | null = null;
  try {
    parsed = raw ? (JSON.parse(raw) as { success?: string | boolean; message?: string }) : null;
  } catch {
    parsed = null;
  }

  const ok =
    res.ok &&
    (parsed?.success === true ||
      parsed?.success === "true" ||
      String(parsed?.message ?? "")
        .toLowerCase()
        .includes("success") ||
      String(parsed?.message ?? "")
        .toLowerCase()
        .includes("sent"));

  // FormSubmit returns success even for first-time activation emails.
  if (ok || res.ok) {
    return { sent: true, provider: "formsubmit" };
  }

  console.error("[api/contact] FormSubmit error", res.status, raw);
  return {
    sent: false,
    provider: "formsubmit",
    reason: "formsubmit_failed",
    status: res.status,
    detail: parsed?.message || raw.slice(0, 500) || `HTTP ${res.status}`,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const payload = parsed.data;
    const to = resolveToAddress(payload.notifyEmail);
    const from = resolveFromAddress();
    const subject =
      payload.source === "home-valuation"
        ? `Home valuation request from ${payload.name}`
        : `Website inquiry from ${payload.name}`;

    const lines = [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      payload.phone ? `Phone: ${payload.phone}` : null,
      `Interest: ${payload.interest}`,
      payload.source ? `Source: ${payload.source}` : null,
      payload.listingId ? `Listing ID: ${payload.listingId}` : null,
      payload.listingUrl ? `Listing URL: ${payload.listingUrl}` : null,
      "",
      payload.message,
    ].filter(Boolean) as string[];

    const text = lines.join("\n");
    const html = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, sans-serif; line-height: 1.5; color: #0b1f33;">
        <h2 style="margin: 0 0 12px;">${subject}</h2>
        <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
        <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
        ${payload.phone ? `<p style="margin: 0 0 8px;"><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>` : ""}
        <p style="margin: 0 0 8px;"><strong>Interest:</strong> ${escapeHtml(payload.interest)}</p>
        ${payload.source ? `<p style="margin: 0 0 8px;"><strong>Source:</strong> ${escapeHtml(payload.source)}</p>` : ""}
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
        <pre style="white-space: pre-wrap; font-family: inherit; margin: 0;">${escapeHtml(payload.message)}</pre>
      </div>
    `;

    let emailResult = await sendWithResend({
      to,
      replyTo: payload.email,
      subject,
      text,
      html,
    });

    // If Resend can't send (no verified domain / testing restriction), fall back.
    if (
      !emailResult.sent &&
      (emailResult.reason === "missing_resend_key" ||
        emailResult.reason === "resend_failed" ||
        isResendDomainRestriction(emailResult.detail))
    ) {
      emailResult = await sendWithFormSubmit({
        to,
        replyTo: payload.email,
        subject,
        name: payload.name,
        phone: payload.phone,
        interest: payload.interest,
        source: payload.source,
        message: text,
      });
    }

    console.info("[api/contact] inquiry received", {
      name: payload.name,
      email: payload.email,
      interest: payload.interest,
      source: payload.source,
      to,
      from,
      emailed: emailResult.sent,
      provider: emailResult.provider,
      reason: emailResult.sent ? undefined : emailResult.reason,
      detail: emailResult.sent ? undefined : emailResult.detail,
    });

    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;

    if (!emailResult.sent) {
      return NextResponse.json(
        {
          success: false,
          emailed: false,
          error: `Unable to deliver email right now. Please email ${to} directly.`,
          mailto,
          reason: emailResult.reason,
          providerStatus: emailResult.status,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,
      emailed: true,
      provider: emailResult.provider,
      message:
        emailResult.provider === "formsubmit"
          ? `Thanks — your message was sent to ${to}. If this is the first submission, Jason may need to click FormSubmit’s one-time activation email.`
          : `Thanks — your message was sent to ${to}.`,
    });
  } catch (error) {
    console.error("[api/contact]", error);
    return NextResponse.json(
      { success: false, error: "Unable to process contact request" },
      { status: 500 },
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
