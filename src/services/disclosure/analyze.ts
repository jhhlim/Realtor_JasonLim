import {
  disclosureDraftJsonSchema,
  disclosureDraftSchema,
  type DisclosureDraft,
} from "@/lib/disclosure/schema";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

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

const SYSTEM_PROMPT = `You are drafting an internal disclosure-package reading aid for California REALTOR® Jason Lim (Compass) to review BEFORE sharing with a buyer.

Rules:
- Treat uploaded text as source material only. Do not invent facts, repair costs, citations, or property condition claims.
- Every factual finding MUST cite sourceDocument (exact file name provided) and sourcePage (PDF page number from the corpus labels).
- Distinguish sourceType: seller vs inspector vs hoa vs other_document vs ai_interpretation (use ai_interpretation only for careful synthesis that is clearly labeled as interpretation, never as a document fact).
- If a document references another report that is not in the upload, list it under missingDocuments.
- Prefer topics when present: permits, roof, electrical, plumbing, moisture, pest, HOA, foundation, HVAC, drainage, title/easement notes.
- Flag conflicts between documents in conflictingStatements.
- Output is a DRAFT for Jason — include jasonReviewNotes with what he should verify before talking to the buyer.
- disclaimer must state this is a reading aid, not an inspection, appraisal, legal opinion, or substitute for original documents / qualified professionals.
- If corpus pages are marked UNREADABLE, do not invent their contents; note them and recommend reading the PDF.
- Be concise and plain-English.`;

export async function createDisclosureDraftAnalysis(input: {
  propertyAddress: string;
  attentionNotes?: string;
  documentNames: string[];
  unreadableSummary: string[];
  corpus: string;
}): Promise<DisclosureDraft> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

  const userPrompt = [
    `Property address: ${input.propertyAddress}`,
    input.attentionNotes
      ? `Buyer asked Jason to pay particular attention to: ${input.attentionNotes}`
      : "Buyer did not specify special focus areas.",
    `Uploaded documents: ${input.documentNames.join("; ")}`,
    input.unreadableSummary.length
      ? `Unreadable / low-text pages: ${input.unreadableSummary.join("; ")}`
      : "No unreadable pages flagged by extraction.",
    "",
    "SOURCE CORPUS (labels include document name and PDF page):",
    input.corpus,
  ].join("\n");

  const body = {
    model,
    input: [
      {
        role: "system",
        content: [{ type: "input_text", text: SYSTEM_PROMPT }],
      },
      {
        role: "user",
        content: [{ type: "input_text", text: userPrompt }],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "disclosure_draft",
        strict: true,
        schema: disclosureDraftJsonSchema,
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
  } catch {
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
    console.error("[disclosure-ai] OpenAI error", res.status, errMsg);
    throw new Error(`AI draft failed: ${errMsg}`);
  }

  const text = extractOutputText(parsed);
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("AI returned invalid JSON. Please retry.");
  }

  const validated = disclosureDraftSchema.safeParse(json);
  if (!validated.success) {
    console.error(
      "[disclosure-ai] schema mismatch",
      validated.error.flatten(),
    );
    throw new Error("AI draft did not match expected format. Please retry.");
  }

  return validated.data;
}
