import { NextResponse } from "next/server";
import { z } from "zod";

import { siteConfig } from "@/config/site";

const newsletterSchema = z.object({
  email: z.string().email("Valid email is required"),
  firstName: z.string().max(80).optional(),
  lastName: z.string().max(80).optional(),
  tags: z.array(z.string()).optional(),
  cityInterest: z.array(z.string()).optional(),
});

function resolveToAddress() {
  return (
    process.env.CONTACT_TO_EMAIL?.trim() ||
    siteConfig.contact.email ||
    "jason.lim@compass.com"
  );
}

/**
 * Newsletter subscribe → FormSubmit email to Jason.
 * First-ever FormSubmit submission to this address may require clicking
 * Activate in the inbox (same as contact form).
 * https://formsubmit.co/
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

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

    const subscriber = parsed.data;
    const to = resolveToAddress();
    const name =
      [subscriber.firstName, subscriber.lastName].filter(Boolean).join(" ") ||
      "Newsletter subscriber";
    const subject = `Newsletter signup from ${name}`;
    const tags = subscriber.tags?.join(", ") || "market-updates";
    const cities = subscriber.cityInterest?.join(", ") || "";

    if (process.env.FORMSUBMIT_DISABLED === "1") {
      return NextResponse.json(
        {
          success: false,
          error: `Unable to deliver signup right now. Please email ${to} directly.`,
        },
        { status: 502 },
      );
    }

    let res: Response;
    try {
      res = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(to)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
            email: subscriber.email,
            form: "newsletter",
            tags,
            cityInterest: cities,
            message: [
              "New market-updates newsletter signup",
              `Name: ${name}`,
              `Email: ${subscriber.email}`,
              `Tags: ${tags}`,
              cities ? `Cities: ${cities}` : null,
            ]
              .filter(Boolean)
              .join("\n"),
            _subject: subject,
            _template: "table",
            _captcha: "false",
          }),
        },
      );
    } catch (error) {
      console.error("[api/newsletter] FormSubmit network error", error);
      return NextResponse.json(
        {
          success: false,
          error: `Unable to deliver signup right now. Please email ${to} directly.`,
        },
        { status: 502 },
      );
    }

    const raw = await res.text().catch(() => "");
    let parsedBody: { success?: string | boolean; message?: string } | null =
      null;
    try {
      parsedBody = raw
        ? (JSON.parse(raw) as { success?: string | boolean; message?: string })
        : null;
    } catch {
      parsedBody = null;
    }

    const ok =
      res.ok &&
      (parsedBody?.success === true ||
        parsedBody?.success === "true" ||
        String(parsedBody?.message ?? "")
          .toLowerCase()
          .includes("success") ||
        String(parsedBody?.message ?? "")
          .toLowerCase()
          .includes("sent"));

    // FormSubmit returns success even for first-time activation emails.
    if (!(ok || res.ok)) {
      console.error("[api/newsletter] FormSubmit error", res.status, raw);
      return NextResponse.json(
        {
          success: false,
          error: `Unable to deliver signup right now. Please email ${to} directly.`,
        },
        { status: 502 },
      );
    }

    console.info("[api/newsletter] signup emailed", {
      email: subscriber.email,
      to,
      provider: "formsubmit",
    });

    return NextResponse.json({
      success: true,
      emailed: true,
      provider: "formsubmit",
      message: `Thanks — your signup was sent to ${to}.`,
    });
  } catch (error) {
    console.error("[api/newsletter]", error);
    return NextResponse.json(
      { success: false, error: "Unable to process newsletter signup" },
      { status: 500 },
    );
  }
}
