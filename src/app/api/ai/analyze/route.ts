import { NextResponse } from "next/server";

import { analyzeRequestSchema } from "@/lib/ai/analysis-schema";
import {
  buildAnalysisSystemPrompt,
  buildAnalysisUserPrompt,
} from "@/lib/ai/prompts";
import { checkRateLimit } from "@/lib/ai/rate-limit";
import { mockNeighborhoods } from "@/data/mock-neighborhoods";
import { createStructuredPropertyAnalysis } from "@/services/ai/openai-responses-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function resolveNeighborhoodSnapshot(inputs: Record<string, unknown>) {
  const slug =
    (typeof inputs.neighborhood === "string" && inputs.neighborhood) ||
    (typeof inputs.neighborhoodSlug === "string" && inputs.neighborhoodSlug) ||
    null;

  if (!slug) return undefined;

  const hood = mockNeighborhoods.find((n) => n.slug === slug);
  if (!hood) return undefined;

  return {
    name: hood.name,
    county: hood.county,
    medianPrice: hood.medianPrice,
    priceChangeYoY: hood.priceChangeYoY,
    avgDom: hood.avgDom,
    schoolsHighlight: hood.schoolsHighlight,
    recentTrend: hood.marketTrend.slice(-6),
  };
}

export async function POST(request: Request) {
  if (process.env.AI_ENABLED === "false") {
    return NextResponse.json(
      { success: false, error: "AI analysis is temporarily disabled." },
      { status: 503 },
    );
  }

  const ip = clientIp(request);
  const rate = checkRateLimit(`ai-analyze:${ip}`);
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

  const parsed = analyzeRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid request.",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const { tool, inputs, computedMetrics, context } = parsed.data;

  try {
    const analysis = await createStructuredPropertyAnalysis({
      systemPrompt: buildAnalysisSystemPrompt(tool),
      userPrompt: buildAnalysisUserPrompt({
        tool,
        inputs,
        computedMetrics,
        context,
        neighborhoodSnapshot: resolveNeighborhoodSnapshot(inputs),
      }),
    });

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error("[api/ai/analyze]", error);
    const message =
      error instanceof Error ? error.message : "Analysis failed.";
    const status = message.includes("OPENAI_API_KEY") ? 503 : 500;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
