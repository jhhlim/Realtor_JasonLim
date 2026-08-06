import {
  propertyAnalysisJsonSchema,
  propertyAnalysisSchema,
  type PropertyAnalysis,
} from "@/lib/ai/analysis-schema";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

interface ResponsesCreateParams {
  systemPrompt: string;
  userPrompt: string;
  model?: string;
}

function extractOutputText(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    throw new Error("Empty response from OpenAI");
  }

  const data = payload as Record<string, unknown>;

  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text;
  }

  const output = data.output;
  if (Array.isArray(output)) {
    const chunks: string[] = [];
    for (const item of output) {
      if (!item || typeof item !== "object") continue;
      const block = item as Record<string, unknown>;
      if (block.type === "message" && Array.isArray(block.content)) {
        for (const part of block.content) {
          if (!part || typeof part !== "object") continue;
          const p = part as Record<string, unknown>;
          if (p.type === "output_text" && typeof p.text === "string") {
            chunks.push(p.text);
          }
        }
      }
    }
    if (chunks.length) return chunks.join("");
  }

  throw new Error("Could not parse OpenAI Responses output");
}

export async function createStructuredPropertyAnalysis(
  params: ResponsesCreateParams,
): Promise<PropertyAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const model =
    params.model?.trim() ||
    process.env.OPENAI_MODEL?.trim() ||
    "gpt-4o-mini";

  const body = {
    model,
    input: [
      {
        role: "system",
        content: [{ type: "input_text", text: params.systemPrompt }],
      },
      {
        role: "user",
        content: [{ type: "input_text", text: params.userPrompt }],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "property_analysis",
        strict: true,
        schema: propertyAnalysisJsonSchema,
      },
    },
    store: false,
  };

  let res: Response;
  try {
    res = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error("[openai-responses] network error", error);
    throw new Error("Unable to reach OpenAI. Try again shortly.");
  }

  const raw = await res.text().catch(() => "");
  let parsed: unknown = null;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = null;
  }

  if (!res.ok) {
    const errMsg =
      parsed &&
      typeof parsed === "object" &&
      "error" in parsed &&
      parsed.error &&
      typeof parsed.error === "object" &&
      "message" in parsed.error
        ? String((parsed.error as { message?: string }).message)
        : raw.slice(0, 300) || `HTTP ${res.status}`;
    console.error("[openai-responses] API error", res.status, errMsg);
    throw new Error(`OpenAI analysis failed: ${errMsg}`);
  }

  const text = extractOutputText(parsed);
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    console.error("[openai-responses] invalid JSON", text.slice(0, 500));
    throw new Error("AI returned invalid JSON. Please retry.");
  }

  const validated = propertyAnalysisSchema.safeParse(json);
  if (!validated.success) {
    console.error("[openai-responses] schema mismatch", validated.error.flatten());
    throw new Error("AI response did not match expected format. Please retry.");
  }

  return validated.data;
}
