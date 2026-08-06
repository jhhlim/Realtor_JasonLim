"use client";

import * as React from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import type { PropertyAnalysis } from "@/lib/ai/analysis-schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function GaugeBar({
  label,
  value,
  max = 100,
  suffix = "",
  invert = false,
}: {
  label: string;
  value: number;
  max?: number;
  suffix?: string;
  invert?: boolean;
}) {
  const pct = Math.min(100, Math.max(0, (Math.abs(value) / max) * 100));
  const display = suffix ? `${value}${suffix}` : `${Math.round(value)}`;
  const barColor = invert
    ? value > 66
      ? "bg-destructive"
      : value > 33
        ? "bg-warning"
        : "bg-accent"
    : value > 66
      ? "bg-accent"
      : value > 33
        ? "bg-warning"
        : "bg-destructive";

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums">{display}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function OverallBadge({
  overall,
}: {
  overall: PropertyAnalysis["jasonRecommendation"]["overall"];
}) {
  const variant =
    overall === "Strong Buy"
      ? "success"
      : overall === "Good Opportunity"
        ? "accent"
        : overall === "Proceed with Caution"
          ? "warning"
          : "secondary";

  return (
    <Badge variant={variant} className="px-3 py-1 text-sm">
      {overall}
    </Badge>
  );
}

function OutlookIcon({ outlook }: { outlook: "up" | "flat" | "down" }) {
  if (outlook === "up") return <ArrowUpRight className="h-4 w-4 text-accent" />;
  if (outlook === "down")
    return <ArrowDownRight className="h-4 w-4 text-destructive" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

export function AiAnalysisPanel({ analysis }: { analysis: PropertyAnalysis }) {
  const { jasonRecommendation: rec } = analysis;

  return (
    <div className="space-y-6">
      <p className="text-xs text-muted-foreground">{analysis.disclaimer}</p>

      {/* Chart gauges */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/70">
          <CardContent className="space-y-4 p-5">
            <GaugeBar
              label="Affordability fit"
              value={analysis.charts.affordabilityGauge}
            />
            <GaugeBar
              label="Risk level"
              value={analysis.charts.riskScore}
              invert
            />
            <GaugeBar
              label="12-mo appreciation"
              value={analysis.charts.appreciationOutlook}
              max={15}
              suffix="%"
            />
          </CardContent>
        </Card>

        <Card className="border-border/70 sm:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <CardTitle className="text-lg">Affordability</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="leading-relaxed">{analysis.affordability.summary}</p>
            <p className="text-muted-foreground">
              <strong className="text-foreground">Monthly comfort:</strong>{" "}
              {analysis.affordability.monthlyComfort}
            </p>
            <p className="text-muted-foreground">
              <strong className="text-foreground">Stretch vs comfortable:</strong>{" "}
              {analysis.affordability.stretchVsComfortable}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risks + Negotiation + Appreciation */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/70">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <CardTitle className="text-lg">Risks</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.risks.items.map((risk) => (
              <div key={risk.title} className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{risk.title}</span>
                  <Badge
                    variant={
                      risk.severity === "high"
                        ? "warning"
                        : risk.severity === "medium"
                          ? "secondary"
                          : "outline"
                    }
                    className="text-[10px]"
                  >
                    {risk.severity}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{risk.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Negotiation ideas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc space-y-1.5 pl-4 text-muted-foreground">
              {analysis.negotiation.ideas.map((idea) => (
                <li key={idea}>{idea}</li>
              ))}
            </ul>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Leverage points
            </p>
            <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
              {analysis.negotiation.leveragePoints.map((pt) => (
                <li key={pt}>{pt}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <OutlookIcon outlook={analysis.appreciation.outlook} />
              <CardTitle className="text-lg">Future appreciation</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="font-display text-2xl font-semibold tabular-nums">
              {analysis.appreciation.projectedPercent12Mo >= 0 ? "+" : ""}
              {analysis.appreciation.projectedPercent12Mo.toFixed(1)}%
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                12 mo
              </span>
            </p>
            <p className="leading-relaxed text-muted-foreground">
              {analysis.appreciation.summary}
            </p>
            <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
              {analysis.appreciation.factors.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Jason's Recommendation — branded hero section */}
      <Card className="overflow-hidden border-accent/30 bg-gradient-to-br from-[#0B1F33] via-[#12304a] to-[#1F6F78] text-white shadow-lift">
        <CardHeader className="space-y-3 pb-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-teal-soft" />
              <CardTitle className="font-display text-xl text-white">
                Jason&apos;s Recommendation
              </CardTitle>
            </div>
            <OverallBadge overall={rec.overall} />
          </div>
          <p className="text-sm leading-relaxed text-white/85">
            {rec.personalRecommendation}
          </p>
        </CardHeader>
        <CardContent className="grid gap-6 pb-8 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
              Top 3 risks
            </p>
            <ul className="space-y-2 text-sm text-white/90">
              {rec.topRisks.map((r, i) => (
                <li key={r} className="flex gap-2">
                  <span className="font-semibold text-teal-soft">{i + 1}.</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
              Top 3 opportunities
            </p>
            <ul className="space-y-2 text-sm text-white/90">
              {rec.topOpportunities.map((o, i) => (
                <li key={o} className="flex gap-2">
                  <span className="font-semibold text-teal-soft">{i + 1}.</span>
                  {o}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
              What I would negotiate
            </p>
            <ul className="list-disc space-y-1 pl-4 text-sm text-white/90">
              {rec.negotiationPoints.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
              Verify before removing contingencies
            </p>
            <ul className="list-disc space-y-1 pl-4 text-sm text-white/90">
              {rec.verifyBeforeContingencies.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
