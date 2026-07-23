"use client";

import * as React from "react";
import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const CHECKLIST = [
  { id: "preapproval", label: "Strong pre-approval (not just pre-qual)" },
  { id: "earnest", label: "Competitive earnest money relative to price" },
  { id: "inspection", label: "Inspection strategy defined (full / limited / waived)" },
  { id: "appraisal", label: "Appraisal gap coverage considered" },
  { id: "close", label: "Close of escrow aligns with seller priorities" },
  { id: "contingencies", label: "Contingency timelines tightened thoughtfully" },
  { id: "letter", label: "Buyer letter (where appropriate) prepared" },
  { id: "terms", label: "Escalation / best-and-final terms modeled" },
] as const;

export function OfferCompetitivenessStub() {
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});

  const score = CHECKLIST.filter((item) => checked[item.id]).length;
  const pct = Math.round((score / CHECKLIST.length) * 100);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent">AI stub</Badge>
            <Badge variant="secondary">Checklist ready now</Badge>
          </div>
          <CardTitle>Offer competitiveness checklist</CardTitle>
          <p className="text-sm text-muted-foreground">
            Work through offer strength factors. Full AI scoring against live comps and DOM
            pressure is coming soon.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {CHECKLIST.map((item) => (
            <label
              key={item.id}
              htmlFor={item.id}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-xl border border-border/80 px-4 py-3 transition-colors",
                checked[item.id] && "border-accent/40 bg-accent/5",
              )}
            >
              <Checkbox
                id={item.id}
                checked={!!checked[item.id]}
                onCheckedChange={(v) =>
                  setChecked((prev) => ({ ...prev, [item.id]: v === true }))
                }
                className="mt-0.5"
              />
              <span className="text-sm leading-relaxed">
                <Label htmlFor={item.id} className="cursor-pointer font-medium">
                  {item.label}
                </Label>
              </span>
            </label>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-slate-soft to-background dark:from-card">
        <CardHeader>
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Checklist coverage
          </p>
          <p className="font-display text-5xl font-semibold">{pct}%</p>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            {score} of {CHECKLIST.length} factors marked. AI will soon weight these against
            neighborhood competition and recent accepted terms.
          </p>
          <ul className="space-y-2">
            {["Comp-adjusted offer range", "Win-probability estimate", "Term tradeoff tips"].map(
              (item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="size-4 text-accent" aria-hidden />
                  {item} — planned
                </li>
              ),
            )}
          </ul>
          <Button asChild variant="accent">
            <a href={siteConfig.cta.consultation.href}>Review strategy with Jason</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
