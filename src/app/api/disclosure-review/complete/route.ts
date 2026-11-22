import { NextResponse } from "next/server";
import { z } from "zod";

import { checkRateLimit } from "@/lib/ai/rate-limit";
import { areDisclosureUploadsEnabled } from "@/lib/disclosure-uploads";
import {
  buildCorpusForModel,
  extractPdfPages,
  type ExtractedPage,
} from "@/lib/disclosure/pdf-extract";
import { createServiceClient } from "@/lib/supabase/service";
import { createDisclosureDraftAnalysis } from "@/services/disclosure/analyze";
import { notifyDisclosureReceived } from "@/services/disclosure/notify";
import { downloadDisclosureFile } from "@/services/disclosure/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const completeSchema = z.object({
  requestId: z.string().uuid(),
  uploadedPaths: z
    .array(
      z.object({
        path: z.string().min(3).max(500),
        originalName: z.string().min(1).max(260),
      }),
    )
    .min(1)
    .max(10),
});

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  if (!areDisclosureUploadsEnabled()) {
    return NextResponse.json(
      { success: false, error: "Secure disclosure upload is not configured yet." },
      { status: 503 },
    );
  }

  const rate = checkRateLimit(`disclosure-complete:${clientIp(request)}`);
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

  const parsed = completeSchema.safeParse(body);
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

  const { requestId, uploadedPaths } = parsed.data;

  for (const item of uploadedPaths) {
    if (!item.path.startsWith(`${requestId}/`)) {
      return NextResponse.json(
        { success: false, error: "Invalid upload path." },
        { status: 400 },
      );
    }
  }

  const supabase = createServiceClient();
  const { data: row, error: loadError } = await supabase
    .from("disclosure_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (loadError || !row) {
    return NextResponse.json(
      { success: false, error: "Disclosure request not found." },
      { status: 404 },
    );
  }

  await supabase
    .from("disclosure_requests")
    .update({ status: "processing", updated_at: new Date().toISOString() })
    .eq("id", requestId);

  try {
    const allPages: ExtractedPage[] = [];
    const unreadable: {
      documentName: string;
      page: number;
      reason: string;
    }[] = [];

    for (const file of uploadedPaths) {
      const buffer = await downloadDisclosureFile(file.path);
      const extracted = await extractPdfPages(buffer, file.originalName);
      allPages.push(...extracted.pages);
      unreadable.push(...extracted.unreadablePages);
    }

    const corpus = buildCorpusForModel(allPages);
    const fileNames = uploadedPaths.map((f) => f.originalName);

    let draft = null;
    let status: "ready_for_jason" | "received_no_ai" = "received_no_ai";
    let aiError: string | null = null;

    if (process.env.AI_ENABLED !== "false" && process.env.OPENAI_API_KEY?.trim()) {
      try {
        draft = await createDisclosureDraftAnalysis({
          propertyAddress: row.property_address,
          attentionNotes: row.attention_notes ?? undefined,
          documentNames: fileNames,
          unreadableSummary: unreadable.map(
            (u) => `${u.documentName} p.${u.page}`,
          ),
          corpus,
        });
        status = "ready_for_jason";
      } catch (error) {
        aiError =
          error instanceof Error ? error.message : "AI draft unavailable";
        console.error("[disclosure-complete] AI failed", aiError);
      }
    }

    const fileMeta = uploadedPaths.map((f) => ({
      path: f.path,
      name: f.originalName,
    }));

    await supabase
      .from("disclosure_requests")
      .update({
        status,
        file_meta: fileMeta,
        unreadable_pages: unreadable,
        draft_report: draft,
        error_message: aiError,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    const notify = await notifyDisclosureReceived({
      requestId,
      fullName: row.full_name,
      email: row.email,
      phone: row.phone ?? undefined,
      preferredContact: row.preferred_contact,
      propertyAddress: row.property_address,
      fileNames,
      status,
      draft,
      unreadableCount: unreadable.length,
    });

    if (notify.sent) {
      await supabase
        .from("disclosure_requests")
        .update({ notified_at: new Date().toISOString() })
        .eq("id", requestId);
    }

    // Never return document text or draft details to the public client.
    return NextResponse.json({
      success: true,
      requestId,
      status,
      preferredContact: row.preferred_contact,
      aiDraftReady: Boolean(draft),
      unreadablePageCount: unreadable.length,
      message:
        "Package received. Jason will follow up using your preferred contact method after reviewing the draft.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Processing failed";
    console.error("[disclosure-complete]", message);
    await supabase
      .from("disclosure_requests")
      .update({
        status: "failed",
        error_message: message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", requestId);

    return NextResponse.json(
      {
        success: false,
        error:
          "We received your files but could not finish processing. Jason can still follow up — please also send a quick note via Review With Jason if you do not hear back.",
      },
      { status: 500 },
    );
  }
}
