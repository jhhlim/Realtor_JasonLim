"use client";

import * as React from "react";

import type { AnalyzeToolType, PropertyAnalysis } from "@/lib/ai/analysis-schema";
import { Button } from "@/components/ui/button";
import { AiAnalysisPanel } from "@/features/tools/ai-analysis-panel";

export function useAiAnalysis() {
  const [analysis, setAnalysis] = React.useState<PropertyAnalysis | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function runAnalysis(params: {
    tool: AnalyzeToolType;
    inputs: Record<string, unknown>;
    computedMetrics?: Record<string, unknown>;
    context?: string;
  }) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const data = (await res.json()) as {
        success?: boolean;
        analysis?: PropertyAnalysis;
        error?: string;
      };

      if (!res.ok || !data.success || !data.analysis) {
        throw new Error(data.error ?? "Analysis failed.");
      }

      setAnalysis(data.analysis);
      return data.analysis;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setAnalysis(null);
    setError(null);
  }

  return { analysis, loading, error, runAnalysis, reset };
}

export function AiAnalyzeSection({
  tool,
  inputs,
  computedMetrics,
  context,
  label = "Get Jason's AI analysis",
  disabled,
}: {
  tool: AnalyzeToolType;
  inputs: Record<string, unknown>;
  computedMetrics?: Record<string, unknown>;
  context?: string;
  label?: string;
  disabled?: boolean;
}) {
  const { analysis, loading, error, runAnalysis } = useAiAnalysis();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="accent"
          disabled={disabled || loading}
          onClick={() =>
            runAnalysis({ tool, inputs, computedMetrics, context })
          }
        >
          {loading ? "Analyzing…" : label}
        </Button>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
      {analysis ? <AiAnalysisPanel analysis={analysis} /> : null}
    </div>
  );
}
