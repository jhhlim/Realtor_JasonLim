import { NextResponse } from "next/server";
import { z } from "zod";

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
});

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

    // Resend-ready stub: wire RESEND_API_KEY + EMAIL_FROM when ready.
    // Example:
    // await resend.emails.send({ from, to, subject, html })
    console.info("[api/contact] inquiry received", {
      name: payload.name,
      email: payload.email,
      interest: payload.interest,
      listingId: payload.listingId,
      hasResendKey: Boolean(process.env.RESEND_API_KEY),
    });

    return NextResponse.json({
      success: true,
      message:
        "Thanks — your message was received. We'll follow up shortly.",
    });
  } catch (error) {
    console.error("[api/contact]", error);
    return NextResponse.json(
      { success: false, error: "Unable to process contact request" },
      { status: 500 },
    );
  }
}
