import { NextResponse } from "next/server";

import { checkRateLimit } from "@/lib/ai/rate-limit";
import { areDisclosureUploadsEnabled } from "@/lib/disclosure-uploads";
import {
  disclosureIntakeSchema,
  MAX_DISCLOSURE_FILE_BYTES,
} from "@/lib/disclosure/schema";
import { createServiceClient } from "@/lib/supabase/service";
import { createSignedDisclosureUploads } from "@/services/disclosure/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  if (!areDisclosureUploadsEnabled()) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Secure disclosure upload is not configured yet. Request a walkthrough instead.",
      },
      { status: 503 },
    );
  }

  const rate = checkRateLimit(`disclosure-init:${clientIp(request)}`);
  if (!rate.ok) {
    return NextResponse.json(
      {
        success: false,
        error: `Rate limit reached. Try again in ${rate.retryAfterSec} seconds.`,
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const parsed = disclosureIntakeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed.",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const data = parsed.data;
  if (data.preferredContact === "phone" && !data.phone?.trim()) {
    return NextResponse.json(
      { success: false, error: "Phone is required when you choose a phone call." },
      { status: 400 },
    );
  }

  for (const file of data.files) {
    const lower = file.name.toLowerCase();
    const typeOk =
      !file.contentType ||
      file.contentType === "application/pdf" ||
      file.contentType === "application/octet-stream";
    if (!lower.endsWith(".pdf") || !typeOk) {
      return NextResponse.json(
        { success: false, error: `Only PDF files are accepted (${file.name}).` },
        { status: 400 },
      );
    }
    if (file.size > MAX_DISCLOSURE_FILE_BYTES) {
      return NextResponse.json(
        { success: false, error: `${file.name} exceeds the size limit.` },
        { status: 400 },
      );
    }
  }

  try {
    const supabase = createServiceClient();
    const { data: row, error } = await supabase
      .from("disclosure_requests")
      .insert({
        property_address: data.propertyAddress,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone || null,
        preferred_contact: data.preferredContact,
        offer_deadline: data.offerDeadline || null,
        working_with_agent: data.workingWithAgent,
        attention_notes: data.attentionNotes || null,
        consent: true,
        status: "pending_upload",
        file_meta: data.files.map((f) => ({
          name: f.name,
          size: f.size,
          contentType: f.contentType ?? "application/pdf",
        })),
      })
      .select("id")
      .single();

    if (error || !row) {
      console.error("[disclosure-init] insert failed", error?.message);
      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to create disclosure request. Confirm the disclosure_requests migration has been applied in Supabase.",
        },
        { status: 500 },
      );
    }

    const uploads = await createSignedDisclosureUploads(row.id, data.files);

    return NextResponse.json({
      success: true,
      requestId: row.id,
      uploads: uploads.map((u) => ({
        path: u.path,
        token: u.token,
        signedUrl: u.signedUrl,
        originalName: u.originalName,
      })),
    });
  } catch (error) {
    console.error("[disclosure-init]", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to start disclosure upload.",
      },
      { status: 500 },
    );
  }
}
