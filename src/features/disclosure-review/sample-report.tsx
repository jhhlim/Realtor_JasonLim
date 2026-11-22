"use client";

import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  disclosureSampleFindings,
  type SampleFinding,
} from "@/data/disclosure-sample";

function tagVariant(tag: SampleFinding["tag"]) {
  if (tag === "Missing document") return "warning" as const;
  if (tag === "Good to know") return "success" as const;
  return "accent" as const;
}

function FindingCard({ finding }: { finding: SampleFinding }) {
  return (
    <article className="space-y-4 rounded-2xl border border-border/70 bg-background p-5 sm:p-6">
      <Badge variant={tagVariant(finding.tag)}>{finding.tag}</Badge>
      <div className="space-y-2">
        <h3 className="font-display text-xl font-semibold tracking-tight text-balance">
          {finding.summary}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty sm:text-base">
          {finding.whyItMatters}
        </p>
      </div>
      <p className="text-xs text-muted-foreground">
        Source: {finding.sourceDocument}, PDF page {finding.sourcePage}
      </p>
      <div className="space-y-2 border-t border-border/60 pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          Questions worth asking
        </p>
        <p className="text-sm leading-relaxed text-foreground/90">
          {finding.followUpQuestion}
        </p>
      </div>
    </article>
  );
}

export function DisclosureSampleReport() {
  const tabs = [
    { value: "electrical", label: "Electrical" },
    { value: "moisture", label: "Moisture" },
    { value: "documents", label: "Documents" },
  ] as const;

  return (
    <div
      id="sample-report"
      className="scroll-mt-28 overflow-hidden rounded-3xl border border-border/80 bg-card shadow-lift"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-5 py-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Disclosure report
          </p>
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            Sample findings
          </h2>
        </div>
        <Badge variant="outline" className="border-accent/40 text-accent">
          Fictional sample
        </Badge>
      </div>

      <div className="p-5 sm:p-6">
        <Tabs defaultValue="electrical">
          <TabsList
            className="grid h-auto w-full grid-cols-3 gap-1"
            aria-label="Sample report topics"
          >
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-xs sm:text-sm">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => {
            const findings = disclosureSampleFindings.filter(
              (f) => f.tab === tab.value,
            );
            return (
              <TabsContent key={tab.value} value={tab.value} className="space-y-4">
                {findings.map((finding) => (
                  <FindingCard key={finding.id} finding={finding} />
                ))}
              </TabsContent>
            );
          })}
        </Tabs>

        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
          Fictional sample only. These findings are made up to show the format and do
          not describe any real property. A real review cites the uploaded file and PDF
          page for every factual finding, and distinguishes seller statements, inspector
          observations, and AI-assisted interpretation.
        </p>
      </div>
    </div>
  );
}
