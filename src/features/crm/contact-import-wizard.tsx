"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { findDuplicatesFor } from "@/features/crm/actions/contacts";
import {
  commitImport,
  type ImportDefaults,
  type ImportRowDecision,
} from "@/features/crm/actions/import";
import { parseCsvContacts } from "@/lib/crm/parse-csv";
import { parseVcardContacts } from "@/lib/crm/parse-vcard";
import { formatPhoneDisplay } from "@/lib/crm/phone";
import type { DuplicateAction, DuplicateMatch, ParsedImportContact } from "@/types/crm";
import { displayName } from "@/types/crm";
import { leadSources, leadStatuses } from "@/config/crm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SourceMode = "apple" | "csv" | "vcf";

export function ContactImportWizard({ mode }: { mode?: SourceMode }) {
  const router = useRouter();
  const [sourceType, setSourceType] = useState<SourceMode>(mode || "apple");
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ParsedImportContact[]>([]);
  const [matches, setMatches] = useState<Record<number, DuplicateMatch | null>>({});
  const [actions, setActions] = useState<Record<number, DuplicateAction>>({});
  const [search, setSearch] = useState("");
  const [step, setStep] = useState<"upload" | "preview" | "done">("upload");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    created: number;
    merged: number;
    skipped: number;
    failed: number;
    error?: string | null;
  } | null>(null);

  const [defaults, setDefaults] = useState<ImportDefaults>({
    crm_contact: true,
    lead_status: "new",
    temperature: "warm",
    is_buyer: false,
    lead_source: "",
    source_detail: "",
    groupName: "",
    tags: [],
  });
  const [tagsText, setTagsText] = useState("");

  const filteredIdx = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows
      .map((r, i) => ({ r, i }))
      .filter(({ r }) => {
        if (!q) return true;
        return [r.first_name, r.last_name, r.email, r.phone, r.organization]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q);
      });
  }, [rows, search]);

  async function onFile(file: File) {
    setError(null);
    setFileName(file.name);
    const text = await file.text();
    const lower = file.name.toLowerCase();
    let parsed: ParsedImportContact[] = [];
    let type: SourceMode = sourceType;

    if (lower.endsWith(".csv")) {
      parsed = parseCsvContacts(text);
      type = "csv";
    } else if (lower.endsWith(".vcf") || lower.endsWith(".vcard")) {
      parsed = parseVcardContacts(text);
      type = sourceType === "apple" ? "apple" : "vcf";
      // Apple: default unselected; CSV: selected
      if (type === "apple") {
        parsed = parsed.map((p) => ({ ...p, selected: false }));
      } else {
        parsed = parsed.map((p) => ({ ...p, selected: true }));
      }
    } else {
      setError("Please upload a .csv or .vcf file.");
      return;
    }

    if (!parsed.length) {
      setError("No contacts found in that file.");
      return;
    }

    setSourceType(type);
    setRows(parsed);
    setLoading(true);
    try {
      const dupes = await findDuplicatesFor(parsed);
      setMatches(dupes);
      const nextActions: Record<number, DuplicateAction> = {};
      parsed.forEach((_, i) => {
        nextActions[i] = dupes[i] ? "skip" : "create";
      });
      setActions(nextActions);
      setStep("preview");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not check duplicates.");
    } finally {
      setLoading(false);
    }
  }

  function toggleAll(selected: boolean) {
    setRows((prev) => prev.map((r) => ({ ...r, selected })));
  }

  async function onImport() {
    setLoading(true);
    setError(null);
    const decisions: ImportRowDecision[] = rows.map((contact, index) => ({
      contact,
      action: contact.selected === false ? "skip" : actions[index] || "create",
      matchId: matches[index]?.contact.id,
      keepEmail: "imported",
      keepPhone: "both",
    }));

    // Only process selected
    const toProcess = decisions.map((d) =>
      d.contact.selected === false ? { ...d, action: "skip" as const } : d,
    );

    const res = await commitImport({
      sourceType:
        sourceType === "apple"
          ? "apple_contacts"
          : sourceType === "csv"
            ? "csv"
            : "vcf",
      fileName,
      rows: toProcess,
      defaults: {
        ...defaults,
        tags: tagsText
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        lead_source: defaults.lead_source || undefined,
      },
    });
    setLoading(false);
    if (!res.success) {
      setError("Import failed.");
      return;
    }
    setStats(res.stats);
    setStep("done");
    router.refresh();
  }

  if (step === "done" && stats) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Import complete</CardTitle>
          <CardDescription>{fileName}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>Processed: {stats.created + stats.merged + stats.skipped + stats.failed}</p>
          <p>Created: {stats.created}</p>
          <p>Merged: {stats.merged}</p>
          <p>Skipped: {stats.skipped}</p>
          <p>Failed: {stats.failed}</p>
          {stats.error ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-destructive">
              {stats.error}
            </p>
          ) : null}
          <div className="flex gap-2 pt-2">
            <Button asChild variant="accent">
              <Link href="/admin/contacts">View contacts</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/contacts/import/history">Import history</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <Link
          href="/admin/contacts"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Contacts
        </Link>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          {sourceType === "apple" ? "Import from Apple Contacts" : "Import contacts"}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          {sourceType === "apple" ? (
            <>
              In Apple Contacts, select people → File → Export → Export vCard… then upload
              the <code>.vcf</code> here. Only check contacts you want as CRM leads — your
              full address book stays out of All Contacts.
            </>
          ) : (
            <>Upload a CSV or vCard. Preview, classify, resolve duplicates, then import.</>
          )}
        </p>
      </div>

      {step === "upload" ? (
        <div className="grid gap-4 md:grid-cols-3">
          {(
            [
              ["apple", "Apple Contacts (.vcf)"],
              ["csv", "CSV spreadsheet"],
              ["vcf", "vCard (.vcf)"],
            ] as const
          ).map(([id, label]) => (
            <Card
              key={id}
              className={`cursor-pointer border-border/70 transition hover:border-accent/40 ${sourceType === id ? "border-accent/50 bg-accent/5" : ""}`}
              onClick={() => setSourceType(id)}
            >
              <CardHeader>
                <CardTitle className="text-base">{label}</CardTitle>
              </CardHeader>
            </Card>
          ))}
          <Card className="md:col-span-3">
            <CardContent className="space-y-3 p-6">
              <Label htmlFor="import-file">Upload file</Label>
              <Input
                id="import-file"
                type="file"
                accept=".csv,.vcf,.vcard,text/vcard,text/csv"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void onFile(f);
                }}
              />
              {loading ? (
                <p className="text-sm text-muted-foreground">Parsing & checking duplicates…</p>
              ) : null}
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {step === "preview" ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Apply to selected contacts</CardTitle>
              <CardDescription>
                Optional CRM classification for this batch (great for open house lists).
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Group</Label>
                <Input
                  value={defaults.groupName || ""}
                  onChange={(e) =>
                    setDefaults((d) => ({ ...d, groupName: e.target.value }))
                  }
                  placeholder="Open House Leads"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Source</Label>
                <select
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                  value={defaults.lead_source || ""}
                  onChange={(e) =>
                    setDefaults((d) => ({ ...d, lead_source: e.target.value }))
                  }
                >
                  <option value="">—</option>
                  {leadSources.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Source detail</Label>
                <Input
                  value={defaults.source_detail || ""}
                  onChange={(e) =>
                    setDefaults((d) => ({ ...d, source_detail: e.target.value }))
                  }
                  placeholder="1868 Anne Marie Ct"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <select
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
                  value={defaults.lead_status || "new"}
                  onChange={(e) =>
                    setDefaults((d) => ({ ...d, lead_status: e.target.value }))
                  }
                >
                  {leadStatuses.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                  placeholder="Berryessa, 95132"
                />
              </div>
              <div className="flex flex-wrap items-end gap-3 pb-1 text-sm">
                {(
                  [
                    ["is_buyer", "Buyer"],
                    ["is_seller", "Seller"],
                    ["is_renter", "Renter"],
                    ["is_neighbor", "Neighbor"],
                    ["is_referral", "Referral"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2">
                    <Checkbox
                      checked={!!defaults[key]}
                      onCheckedChange={(c) =>
                        setDefaults((d) => ({ ...d, [key]: c === true }))
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <Checkbox
                  checked={defaults.crm_contact !== false}
                  onCheckedChange={(c) =>
                    setDefaults((d) => ({ ...d, crm_contact: c === true }))
                  }
                />
                Mark as CRM contacts (show in All Contacts)
              </label>
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Input
              className="max-w-sm"
              placeholder="Search imported…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => toggleAll(true)}>
                Select all
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => toggleAll(false)}>
                Clear
              </Button>
              <Button
                type="button"
                variant="accent"
                disabled={loading || !rows.some((r) => r.selected)}
                onClick={() => void onImport()}
              >
                {loading
                  ? "Importing…"
                  : `Import selected (${rows.filter((r) => r.selected).length})`}
              </Button>
            </div>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="overflow-hidden rounded-2xl border border-border/70">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Import</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Existing CRM match</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIdx.map(({ r, i }) => {
                  const match = matches[i];
                  return (
                    <TableRow key={r.tempId}>
                      <TableCell>
                        <Checkbox
                          checked={!!r.selected}
                          onCheckedChange={(c) =>
                            setRows((prev) =>
                              prev.map((row, idx) =>
                                idx === i ? { ...row, selected: c === true } : row,
                              ),
                            )
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {displayName(r)}
                        {r.organization ? (
                          <span className="block text-xs text-muted-foreground">
                            {r.organization}
                          </span>
                        ) : null}
                      </TableCell>
                      <TableCell>{formatPhoneDisplay(r.phone)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.email || "—"}
                      </TableCell>
                      <TableCell>
                        {match ? (
                          <div className="text-sm">
                            <Badge variant="warning" className="mb-1">
                              Possible duplicate ({match.strength})
                            </Badge>
                            <p>
                              {displayName(match.contact)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {match.contact.email} · {formatPhoneDisplay(match.contact.phone)}
                            </p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <select
                          className="h-9 rounded-lg border border-input bg-background px-2 text-sm"
                          value={actions[i] || "create"}
                          onChange={(e) =>
                            setActions((a) => ({
                              ...a,
                              [i]: e.target.value as DuplicateAction,
                            }))
                          }
                          disabled={!match}
                        >
                          <option value="create">Create separate</option>
                          <option value="merge">Merge</option>
                          <option value="skip">Skip</option>
                        </select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      ) : null}
    </div>
  );
}
