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

async function sendWithResend(input: {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false as const, reason: "missing_resend_key" };

  const from =
    process.env.EMAIL_FROM ??
    siteConfig.integrations.email.from ??
    `Jason Lim <${siteConfig.contact.email}>`;

  const res = await fetch("https://api.resend.com/emails", {
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
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[api/contact] Resend error", res.status, detail);
    return { sent: false as const, reason: "resend_failed" };
  }

  return { sent: true as const };
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
    const to = payload.notifyEmail || siteConfig.contact.email;
    const subject =
      payload.source === "home-valuation"
        ? `Home valuation request from ${payload.name}`
        : `Website inquiry from ${payload.name}`;

    const text = [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      payload.phone ? `Phone: ${payload.phone}` : null,
      `Interest: ${payload.interest}`,
      payload.source ? `Source: ${payload.source}` : null,
      payload.listingId ? `Listing ID: ${payload.listingId}` : null,
      payload.listingUrl ? `Listing URL: ${payload.listingUrl}` : null,
      "",
      payload.message,
    ]
      .filter(Boolean)
      .join("\n");

    const emailResult = await sendWithResend({
      to,
      replyTo: payload.email,
      subject,
      text,
    });

    console.info("[api/contact] inquiry received", {
      name: payload.name,
      email: payload.email,
      interest: payload.interest,
      source: payload.source,
      to,
      emailed: emailResult.sent,
    });

    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;

    return NextResponse.json({
      success: true,
      message: emailResult.sent
        ? `Thanks — your message was sent to ${to}.`
        : `Thanks — your message was received. We'll follow up at ${to}.`,
      emailed: emailResult.sent,
      // Client may open this when transactional email is not configured.
      mailto: emailResult.sent ? undefined : mailto,
    });
  } catch (error) {
    console.error("[api/contact]", error);
    return NextResponse.json(
      { success: false, error: "Unable to process contact request" },
      { status: 500 },
    );
  }
}
