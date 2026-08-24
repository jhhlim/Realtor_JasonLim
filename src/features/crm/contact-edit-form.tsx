"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { updateContact } from "@/features/crm/actions/contacts";
import type { CrmContact } from "@/types/crm";
import { leadSources, leadStatuses } from "@/config/crm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function ContactEditForm({ contact }: { contact: CrmContact }) {
  const router = useRouter();
  const [saving, setSaving] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    first_name: contact.first_name,
    last_name: contact.last_name,
    email: contact.email || "",
    phone: contact.phone || "",
    secondary_phone: contact.secondary_phone || "",
    preferred_contact_method: contact.preferred_contact_method || "any",
    is_buyer: contact.is_buyer,
    is_seller: contact.is_seller,
    is_renter: contact.is_renter,
    is_investor: contact.is_investor,
    is_neighbor: contact.is_neighbor,
    is_referral: contact.is_referral,
    lead_source: contact.lead_source || "",
    source_detail: contact.source_detail || "",
    lead_status: contact.lead_status,
    temperature: contact.temperature,
    budget_min: contact.budget_min?.toString() || "",
    budget_max: contact.budget_max?.toString() || "",
    desired_cities: (contact.desired_cities || []).join(", "),
    desired_zips: (contact.desired_zips || []).join(", "),
    neighborhoods: (contact.neighborhoods || []).join(", "),
    preapproval_status: contact.preapproval_status || "",
    lender: contact.lender || "",
    seller_property_address: contact.seller_property_address || "",
    selling_timeframe: contact.selling_timeframe || "",
    next_follow_up_at: contact.next_follow_up_at
      ? contact.next_follow_up_at.slice(0, 10)
      : "",
    outreach_interval_days: String(contact.outreach_interval_days ?? 4),
    key_background: contact.key_background || "",
  });

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const res = await updateContact(contact.id, {
      ...form,
      email: form.email || null,
      phone: form.phone || null,
      secondary_phone: form.secondary_phone || null,
      preferred_contact_method: form.preferred_contact_method,
      lead_source: form.lead_source || null,
      source_detail: form.source_detail || null,
      budget_min: form.budget_min ? Number(form.budget_min) : null,
      budget_max: form.budget_max ? Number(form.budget_max) : null,
      desired_cities: form.desired_cities
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      desired_zips: form.desired_zips
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      neighborhoods: form.neighborhoods
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      preapproval_status: form.preapproval_status || null,
      lender: form.lender || null,
      seller_property_address: form.seller_property_address || null,
      selling_timeframe: form.selling_timeframe || null,
      next_follow_up_at: form.next_follow_up_at
        ? new Date(form.next_follow_up_at).toISOString()
        : null,
      outreach_interval_days: Number(form.outreach_interval_days) || 4,
      key_background: form.key_background || null,
    });
    setSaving(false);
    if (!res.success) {
      setMsg(res.error);
      return;
    }
    setMsg("Saved");
    router.refresh();
  }

  const typeToggle = (
    key:
      | "is_buyer"
      | "is_seller"
      | "is_renter"
      | "is_investor"
      | "is_neighbor"
      | "is_referral",
    label: string,
  ) => (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={form[key]}
        onChange={(e) => set(key, e.target.checked)}
      />
      {label}
    </label>
  );

  return (
    <form onSubmit={onSave} className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>First name</Label>
          <Input value={form.first_name} onChange={(e) => set("first_name", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Last name</Label>
          <Input value={form.last_name} onChange={(e) => set("last_name", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Phone</Label>
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Classification</Label>
        <div className="flex flex-wrap gap-3">
          {typeToggle("is_buyer", "Buyer")}
          {typeToggle("is_seller", "Seller")}
          {typeToggle("is_renter", "Renter")}
          {typeToggle("is_investor", "Investor")}
          {typeToggle("is_neighbor", "Neighbor")}
          {typeToggle("is_referral", "Referral")}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={form.lead_status} onValueChange={(v) => set("lead_status", v as typeof form.lead_status)}>
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
        </div>
        <div className="space-y-1.5">
          <Label>Temperature</Label>
          <Select value={form.temperature} onValueChange={(v) => set("temperature", v as typeof form.temperature)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hot">Hot</SelectItem>
              <SelectItem value="warm">Warm</SelectItem>
              <SelectItem value="cold">Cold</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Lead source</Label>
          <Select
            value={form.lead_source || "none"}
            onValueChange={(v) => set("lead_source", v === "none" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">—</SelectItem>
              {leadSources.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Source detail</Label>
          <Input
            value={form.source_detail}
            onChange={(e) => set("source_detail", e.target.value)}
            placeholder="e.g. 1868 Anne Marie Ct"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Budget min</Label>
          <Input
            type="number"
            value={form.budget_min}
            onChange={(e) => set("budget_min", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Budget max</Label>
          <Input
            type="number"
            value={form.budget_max}
            onChange={(e) => set("budget_max", e.target.value)}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Cities</Label>
          <Input
            value={form.desired_cities}
            onChange={(e) => set("desired_cities", e.target.value)}
            placeholder="San Jose, Milpitas"
          />
        </div>
        <div className="space-y-1.5">
          <Label>ZIPs</Label>
          <Input
            value={form.desired_zips}
            onChange={(e) => set("desired_zips", e.target.value)}
            placeholder="95132"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Neighborhoods</Label>
          <Input
            value={form.neighborhoods}
            onChange={(e) => set("neighborhoods", e.target.value)}
            placeholder="Berryessa"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Preapproval</Label>
          <Input
            value={form.preapproval_status}
            onChange={(e) => set("preapproval_status", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Next follow-up</Label>
          <Input
            type="date"
            value={form.next_follow_up_at}
            onChange={(e) => set("next_follow_up_at", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Outreach interval (days)</Label>
          <Input
            type="number"
            value={form.outreach_interval_days}
            onChange={(e) => set("outreach_interval_days", e.target.value)}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Seller property</Label>
          <Input
            value={form.seller_property_address}
            onChange={(e) => set("seller_property_address", e.target.value)}
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Key background (pinned)</Label>
          <Textarea
            rows={3}
            value={form.key_background}
            onChange={(e) => set("key_background", e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" variant="accent" disabled={saving}>
          {saving ? "Saving…" : "Save details"}
        </Button>
        {msg ? <span className="text-sm text-muted-foreground">{msg}</span> : null}
      </div>
    </form>
  );
}
