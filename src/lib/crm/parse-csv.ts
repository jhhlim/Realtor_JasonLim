import type { ParsedImportContact } from "@/types/crm";

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur.trim());
  return out;
}

function headerKey(h: string) {
  return h.trim().toLowerCase().replace(/[\s_-]+/g, "");
}

const FIELD_MAP: Record<string, keyof ParsedImportContact | "full_name" | "notes"> = {
  firstname: "first_name",
  first: "first_name",
  givenname: "first_name",
  lastname: "last_name",
  last: "last_name",
  surname: "last_name",
  familyname: "last_name",
  name: "full_name",
  fullname: "full_name",
  email: "email",
  emailaddress: "email",
  e_mail: "email",
  phone: "phone",
  mobile: "phone",
  cellphone: "phone",
  homephone: "phone",
  workphone: "secondary_phone",
  secondaryphone: "secondary_phone",
  organization: "organization",
  company: "organization",
  org: "organization",
  title: "job_title",
  jobtitle: "job_title",
  notes: "notes",
  note: "notes",
  address: "address",
  street: "address",
};

function applyFullName(c: ParsedImportContact, full: string) {
  const parts = full.trim().split(/\s+/);
  if (!c.first_name && parts[0]) c.first_name = parts[0];
  if (!c.last_name && parts.length > 1) c.last_name = parts.slice(1).join(" ");
}

export function parseCsvContacts(text: string): ParsedImportContact[] {
  const lines = text
    .replace(/^\uFEFF/, "")
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = splitCsvLine(lines[0]).map(headerKey);
  const mapped = headers.map((h) => FIELD_MAP[h] ?? null);

  const results: ParsedImportContact[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const row: ParsedImportContact = {
      tempId: `csv-${i}`,
      first_name: "",
      last_name: "",
      selected: true,
    };
    let note: string | undefined;
    let fullName: string | undefined;

    cols.forEach((val, idx) => {
      const key = mapped[idx];
      if (!key || !val) return;
      if (key === "full_name") fullName = val;
      else if (key === "notes") note = val;
      else if (key === "first_name" || key === "last_name") row[key] = val;
      else if (
        key === "email" ||
        key === "phone" ||
        key === "secondary_phone" ||
        key === "organization" ||
        key === "job_title" ||
        key === "address"
      ) {
        row[key] = val;
      }
    });

    if (fullName) applyFullName(row, fullName);
    if (note) row.note = note;
    if (!row.first_name && !row.last_name && !row.email && !row.phone) continue;
    if (!row.first_name) row.first_name = row.email?.split("@")[0] || "Unknown";
    results.push(row);
  }
  return results;
}
