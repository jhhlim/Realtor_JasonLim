"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus, Search, Upload } from "lucide-react";

import type { CrmContact } from "@/types/crm";
import { displayName, statusLabel } from "@/types/crm";
import { formatPhoneDisplay } from "@/lib/crm/phone";
import { leadSources, leadStatuses } from "@/config/crm";
import { QuickCreateContactDialog } from "@/components/crm/global-quick-add";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function typeBadges(c: CrmContact) {
  const types: string[] = [];
  if (c.is_buyer) types.push("Buyer");
  if (c.is_seller) types.push("Seller");
  if (c.is_renter) types.push("Renter");
  if (c.is_investor) types.push("Investor");
  if (c.is_neighbor) types.push("Neighbor");
  if (c.is_referral) types.push("Referral");
  return types;
}

export function ContactsTable({ contacts }: { contacts: CrmContact[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [source, setSource] = useState<string>("all");
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      if (status !== "all" && c.lead_status !== status) return false;
      if (source !== "all" && c.lead_source !== source) return false;
      if (!q.trim()) return true;
      const hay = [
        c.first_name,
        c.last_name,
        c.email,
        c.phone,
        c.lead_source,
        c.source_detail,
        ...typeBadges(c),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q.trim().toLowerCase());
    });
  }, [contacts, q, status, source]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Contacts
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            All Contacts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-estate CRM database ({filtered.length} shown)
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/contacts/import">
              <Upload className="h-4 w-4" />
              Import
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/contacts/import/history">Import history</Link>
          </Button>
          <Button type="button" variant="accent" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            New Contact
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search contacts, email, phone, tags, source..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {leadStatuses.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={source} onValueChange={setSource}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            {leadSources.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden sm:table-cell">Phone</TableHead>
              <TableHead className="hidden lg:table-cell">Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden xl:table-cell">Source</TableHead>
              <TableHead className="hidden xl:table-cell">Follow-up</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  No CRM contacts yet. Create one or import from Apple Contacts / CSV.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c.id} className="cursor-pointer hover:bg-secondary/40">
                  <TableCell>
                    <Link
                      href={`/admin/contacts/${c.id}`}
                      className="font-medium hover:text-accent"
                    >
                      {displayName(c)}
                    </Link>
                    {c.email_opt_out ? (
                      <Badge variant="warning" className="ml-2">
                        Unsubscribed
                      </Badge>
                    ) : null}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {c.email || "—"}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {formatPhoneDisplay(c.phone)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {typeBadges(c).map((t) => (
                        <Badge key={t} variant="outline">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{statusLabel(c.lead_status)}</Badge>
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground xl:table-cell">
                    {c.lead_source || "—"}
                    {c.source_detail ? (
                      <span className="block text-xs">{c.source_detail}</span>
                    ) : null}
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground xl:table-cell">
                    {c.next_follow_up_at
                      ? new Date(c.next_follow_up_at).toLocaleDateString()
                      : "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <QuickCreateContactDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
