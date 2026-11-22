import { extractText, getDocumentProxy } from "unpdf";

export interface ExtractedPage {
  documentName: string;
  page: number;
  text: string;
  unreadable: boolean;
}

export interface ExtractionResult {
  pages: ExtractedPage[];
  unreadablePages: { documentName: string; page: number; reason: string }[];
  totalPages: number;
}

const MIN_CHARS_FOR_READABLE = 40;

/**
 * Extract per-page text. Scanned/image-only pages are flagged as unreadable
 * (OCR is not configured in this deployment).
 */
export async function extractPdfPages(
  buffer: ArrayBuffer | Uint8Array,
  documentName: string,
): Promise<ExtractionResult> {
  const data =
    buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);

  const pdf = await getDocumentProxy(data);
  const extracted = await extractText(pdf, { mergePages: false });
  const pageTexts = Array.isArray(extracted.text)
    ? extracted.text
    : [String(extracted.text ?? "")];

  const pages: ExtractedPage[] = [];
  const unreadablePages: ExtractionResult["unreadablePages"] = [];

  pageTexts.forEach((raw, index) => {
    const page = index + 1;
    const text = String(raw ?? "")
      .replace(/\u0000/g, "")
      .trim();
    const unreadable = text.replace(/\s+/g, " ").length < MIN_CHARS_FOR_READABLE;
    pages.push({ documentName, page, text, unreadable });
    if (unreadable) {
      unreadablePages.push({
        documentName,
        page,
        reason:
          "Little or no extractable text — page may be scanned/image-only. OCR is not enabled; read the original PDF.",
      });
    }
  });

  return {
    pages,
    unreadablePages,
    totalPages: pages.length || extracted.totalPages || 0,
  };
}

/** Build a capped source corpus for the model — never log this string. */
export function buildCorpusForModel(
  pages: ExtractedPage[],
  maxChars = 120_000,
): string {
  const chunks: string[] = [];
  let used = 0;

  for (const page of pages) {
    if (page.unreadable) {
      const note = `[${page.documentName} · PDF page ${page.page}] [UNREADABLE — no extractable text]\n`;
      if (used + note.length > maxChars) break;
      chunks.push(note);
      used += note.length;
      continue;
    }

    const body = page.text.slice(0, 6000);
    const block = `[${page.documentName} · PDF page ${page.page}]\n${body}\n\n`;
    if (used + block.length > maxChars) {
      chunks.push(
        `[Truncated remaining pages to stay within model context. Prefer citing pages already included.]`,
      );
      break;
    }
    chunks.push(block);
    used += block.length;
  }

  return chunks.join("");
}
