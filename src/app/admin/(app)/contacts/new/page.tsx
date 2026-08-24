"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

import { createContact } from "@/features/crm/actions/contacts";
import { leadSources, leadStatuses } from "@/config/crm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewContactPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await createContact({
      first_name: String(fd.get("first_name") || ""),
      last_name: String(fd.get("last_name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      is_buyer: fd.get("is_buyer") === "on",
      is_seller: fd.get("is_seller") === "on",
      is_renter: fd.get("is_renter") === "on",
      is_investor: fd.get("is_investor") === "on",
      is_neighbor: fd.get("is_neighbor") === "on",
      is_referral: fd.get("is_referral") === "on",
      lead_source: String(fd.get("lead_source") || "") || null,
      source_detail: String(fd.get("source_detail") || "") || null,
      lead_status: String(fd.get("lead_status") || "new"),
      temperature: String(fd.get("temperature") || "warm"),
      crm_contact: true,
    });
    setLoading(false);
    if (!res.success) {
      setError(res.error);
      return;
    }
    router.push(`/admin/contacts/${res.contact.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/admin/contacts" className="text-sm text-muted-foreground hover:text-foreground">
          ← Contacts
        </Link>
        <h1 className="mt-2 font-display text-3xl font-semibold">New contact</h1>
        <p className="text-sm text-muted-foreground">
          Only first name is required. Add classification when you have it.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contact details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first_name">First name *</Label>
              <Input id="first_name" name="first_name" required autoFocus />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last name</Label>
              <Input id="last_name" name="last_name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Type</Label>
              <div className="flex flex-wrap gap-4 text-sm">
                {["buyer", "seller", "renter", "investor", "neighbor", "referral"].map(
                  (t) => (
                    <label key={t} className="flex items-center gap-2 capitalize">
                      <input type="checkbox" name={`is_${t}`} />
                      {t}
                    </label>
                  ),
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select name="lead_status" defaultValue="new">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {leadStatuses.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Select doesn't submit name — use hidden via controlled alternative: native select */}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead_status">Lead status</Label>
              <select
                id="lead_status"
                name="lead_status"
                defaultValue="new"
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
              >
                {leadStatuses.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature</Label>
              <select
                id="temperature"
                name="temperature"
                defaultValue="warm"
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
              >
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead_source">Source</Label>
              <select
                id="lead_source"
                name="lead_source"
                defaultValue=""
                className="flex h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
              >
                <option value="">—</option>
                {leadSources.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="source_detail">Source detail</Label>
              <Input
                id="source_detail"
                name="source_detail"
                placeholder="1868 Anne Marie Ct open house"
              />
            </div>
            {error ? (
              <p className="text-sm text-destructive sm:col-span-2">{error}</p>
            ) : null}
            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit" variant="accent" disabled={loading}>
                {loading ? "Saving…" : "Create contact"}
              </Button>
              <Button asChild type="button" variant="outline">
                <Link href="/admin/contacts">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
