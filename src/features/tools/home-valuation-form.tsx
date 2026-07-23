"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";

export function HomeValuationForm() {
  const [submitted, setSubmitted] = React.useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Request received</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Thanks — Jason will follow up with a data-backed valuation conversation. AI
            automated estimates are on the roadmap and will appear here once models are wired.
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
            AI valuation coming soon. Capture your details for a human CMA in the meantime.
          </p>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="first">First name</Label>
              <Input id="first" name="first" required autoComplete="given-name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last">Last name</Label>
              <Input id="last" name="last" required autoComplete="family-name" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" autoComplete="tel" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Property address</Label>
              <Input id="address" name="address" required autoComplete="street-address" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" name="notes" placeholder="Remodels, timing, goals…" />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" variant="accent" size="lg">
                Submit valuation request
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-dashed bg-slate-soft/40 dark:bg-secondary/20">
        <CardHeader>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Coming soon
          </p>
          <CardTitle className="text-xl">AI estimate engine</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            Planned stack: comps retrieval via MLS adapter → feature embeddings → LLM
            narrative with confidence bands.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Instant range with confidence interval</li>
            <li>Explainable comps and adjustments</li>
            <li>CRM lead sync on request</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
