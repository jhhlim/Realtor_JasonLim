"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";

type Status = "idle" | "loading" | "success" | "error";

export function HomeValuationForm() {
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const first = String(data.get("first") ?? "").trim();
    const last = String(data.get("last") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const address = String(data.get("address") ?? "").trim();
    const notes = String(data.get("notes") ?? "").trim();
    const name = `${first} ${last}`.trim();

    const message = [
      "Home valuation request",
      `Property: ${address}`,
      phone ? `Phone: ${phone}` : null,
      notes ? `Notes: ${notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          interest: "sell",
          source: "home-valuation",
          notifyEmail: siteConfig.contact.email,
        }),
      });

      const json = (await res.json().catch(() => null)) as
        | { success?: boolean; error?: string; mailto?: string }
        | null;

      if (!res.ok || !json?.success) {
        // Fallback: open mail client addressed to Compass email
        const subject = encodeURIComponent(`Home valuation request — ${address}`);
        const body = encodeURIComponent(
          [
            `Name: ${name}`,
            `Email: ${email}`,
            phone ? `Phone: ${phone}` : null,
            `Property: ${address}`,
            notes ? `Notes: ${notes}` : null,
          ]
            .filter(Boolean)
            .join("\n"),
        );
        window.location.href = `mailto:${siteConfig.contact.email}?subject=${subject}&body=${body}`;
        setStatus("success");
        form.reset();
        return;
      }

      if (json.mailto) {
        window.location.href = json.mailto;
      }

      setStatus("success");
      form.reset();
    } catch {
      const subject = encodeURIComponent(`Home valuation request — ${address}`);
      const body = encodeURIComponent(
        [
          `Name: ${name}`,
          `Email: ${email}`,
          phone ? `Phone: ${phone}` : null,
          `Property: ${address}`,
          notes ? `Notes: ${notes}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
      );
      window.location.href = `mailto:${siteConfig.contact.email}?subject=${subject}&body=${body}`;
      setStatus("success");
      setError(null);
      form.reset();
    }
  }

  if (status === "success") {
    return (
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Request sent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Thanks — your valuation request is on its way to{" "}
            <a
              className="font-medium text-accent hover:underline"
              href={`mailto:${siteConfig.contact.email}`}
            >
              {siteConfig.contact.email}
            </a>
            . Jason will follow up shortly.
          </p>
          <Button asChild variant="accent">
            <a href={siteConfig.cta.consultation.href}>Schedule a call</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>Request a valuation</CardTitle>
          <p className="text-sm text-muted-foreground">
            Submit your property details and Jason will follow up at{" "}
            {siteConfig.contact.email}.
          </p>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="first">First name</Label>
              <Input
                id="first"
                name="first"
                required
                autoComplete="given-name"
                disabled={status === "loading"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last">Last name</Label>
              <Input
                id="last"
                name="last"
                required
                autoComplete="family-name"
                disabled={status === "loading"}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                disabled={status === "loading"}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                disabled={status === "loading"}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Property address</Label>
              <Input
                id="address"
                name="address"
                required
                autoComplete="street-address"
                disabled={status === "loading"}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Remodels, timing, goals…"
                disabled={status === "loading"}
              />
            </div>
            {error ? (
              <p className="sm:col-span-2 text-sm text-destructive">{error}</p>
            ) : null}
            <div className="sm:col-span-2">
              <Button
                type="submit"
                variant="accent"
                size="lg"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Sending…" : "Submit valuation request"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-dashed bg-slate-soft/40 dark:bg-secondary/20">
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            What happens next
          </p>
          <CardTitle className="text-xl">Data-backed CMA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Requests go directly to {siteConfig.contact.email}. Expect a reply with comps,
            pricing strategy, and next steps — not a black-box number alone.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Recent comparable sales nearby</li>
            <li>Condition and remodel adjustments</li>
            <li>Timing and marketing recommendations</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
