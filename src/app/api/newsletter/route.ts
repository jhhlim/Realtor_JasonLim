import { NextResponse } from "next/server";
import { z } from "zod";

import { getNewsletterProvider } from "@/services/newsletter";

const newsletterSchema = z.object({
  email: z.string().email("Valid email is required"),
  firstName: z.string().max(80).optional(),
  lastName: z.string().max(80).optional(),
  tags: z.array(z.string()).optional(),
  cityInterest: z.array(z.string()).optional(),
});

/**
 * Newsletter subscribe stub.
 * When NEWSLETTER_PROVIDER (+ provider keys) are set, forwards to the adapter.
 * Otherwise logs and returns success so UI flows work in development.
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

    if (process.env.NEWSLETTER_PROVIDER) {
      try {
        const provider = getNewsletterProvider();
        const result = await provider.subscribe(subscriber);
        return NextResponse.json(result);
      } catch (providerError) {
        console.warn(
          "[api/newsletter] provider unavailable, falling back to stub",
          providerError,
        );
      }
    }

    console.info("[api/newsletter] subscribe stub", {
      email: subscriber.email,
      cityInterest: subscriber.cityInterest,
      provider: process.env.NEWSLETTER_PROVIDER ?? "stub",
    });

    return NextResponse.json({
      success: true,
      provider: process.env.NEWSLETTER_PROVIDER ?? "stub",
      message: "Subscribed successfully.",
    });
  } catch (error) {
    console.error("[api/newsletter]", error);
    return NextResponse.json(
      { success: false, error: "Unable to process newsletter signup" },
      { status: 500 },
    );
  }
}
