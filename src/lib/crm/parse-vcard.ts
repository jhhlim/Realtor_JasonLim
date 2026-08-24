import type { ParsedImportContact } from "@/types/crm";

/**
 * Minimal vCard 2.1 / 3.0 / 4.0 parser for Apple Contacts exports.
 * Handles folded lines and multiple TEL/EMAIL.
 */
export function parseVcardContacts(text: string): ParsedImportContact[] {
  const unfolded = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n[ \t]/g, "");

  const cards = unfolded.split(/BEGIN:VCARD/i).slice(1);
  const results: ParsedImportContact[] = [];

  cards.forEach((raw, index) => {
    const block = raw.split(/END:VCARD/i)[0] ?? raw;
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

    let first = "";
    let last = "";
    let full = "";
    const emails: string[] = [];
    const phones: string[] = [];
    let org = "";
    let title = "";
    let note = "";
    let address = "";

    for (const line of lines) {
      const colon = line.indexOf(":");
      if (colon < 0) continue;
      const left = line.slice(0, colon);
      const value = line.slice(colon + 1).trim();
      const prop = left.split(";")[0].toUpperCase();
      const params = left.toUpperCase();

      if (prop === "N") {
        // Family;Given;Additional;Prefix;Suffix
        const parts = value.split(";");
        last = unescapeVcard(parts[0] || "");
        first = unescapeVcard(parts[1] || "");
      } else if (prop === "FN") {
        full = unescapeVcard(value);
      } else if (prop === "EMAIL") {
        emails.push(unescapeVcard(value));
      } else if (prop === "TEL") {
        phones.push(unescapeVcard(value));
      } else if (prop === "ORG") {
        org = unescapeVcard(value.split(";")[0] || "");
      } else if (prop === "TITLE") {
        title = unescapeVcard(value);
      } else if (prop === "NOTE") {
        note = unescapeVcard(value).replace(/\\n/g, "\n");
      } else if (prop === "ADR" || params.startsWith("ADR")) {
        // po;ext;street;city;region;postal;country
        const parts = value.split(";").map(unescapeVcard);
        address = [parts[2], parts[3], parts[4], parts[5], parts[6]]
          .filter(Boolean)
          .join(", ");
      }
    }

    if (!first && !last && full) {
      const parts = full.split(/\s+/);
      first = parts[0] || "";
      last = parts.slice(1).join(" ");
    }
    if (!first && !last && !emails[0] && !phones[0]) return;

    results.push({
      tempId: `vcf-${index}`,
      first_name: first || emails[0]?.split("@")[0] || "Unknown",
      last_name: last || "",
      email: emails[0],
      phone: phones[0],
      secondary_phone: phones[1],
      organization: org || undefined,
      job_title: title || undefined,
      note: note || undefined,
      address: address || undefined,
      selected: false, // Apple Contacts: opt-in, don't select all by default
    });
  });

  return results;
}

function unescapeVcard(s: string) {
  return s
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\")
    .trim();
}
