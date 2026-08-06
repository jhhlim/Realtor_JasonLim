import { z } from "zod";

export const overallRecommendationSchema = z.enum([
  "Strong Buy",
  "Good Opportunity",
  "Proceed with Caution",
  "Pass",
]);

export const jasonRecommendationSchema = z.object({
  personalRecommendation: z.string(),
  topRisks: z.tuple([z.string(), z.string(), z.string()]),
  topOpportunities: z.tuple([z.string(), z.string(), z.string()]),
  negotiationPoints: z.array(z.string()).min(1).max(5),
  verifyBeforeContingencies: z.array(z.string()).min(1).max(5),
  overall: overallRecommendationSchema,
});

export const propertyAnalysisSchema = z.object({
  disclaimer: z.string(),
  affordability: z.object({
    summary: z.string(),
    monthlyComfort: z.string(),
    stretchVsComfortable: z.string(),
    score: z.number().min(0).max(100),
  }),
  risks: z.object({
    items: z
      .array(
        z.object({
          title: z.string(),
          severity: z.enum(["low", "medium", "high"]),
          detail: z.string(),
        }),
      )
      .min(2)
      .max(6),
  }),
  negotiation: z.object({
    ideas: z.array(z.string()).min(1).max(6),
    leveragePoints: z.array(z.string()).min(1).max(5),
  }),
  appreciation: z.object({
    outlook: z.enum(["up", "flat", "down"]),
    projectedPercent12Mo: z.number().min(-20).max(20),
    summary: z.string(),
    factors: z.array(z.string()).min(2).max(6),
  }),
  charts: z.object({
    affordabilityGauge: z.number().min(0).max(100),
    riskScore: z.number().min(0).max(100),
    appreciationOutlook: z.number().min(-15).max(15),
  }),
  jasonRecommendation: jasonRecommendationSchema,
});

export type PropertyAnalysis = z.infer<typeof propertyAnalysisSchema>;
export type JasonRecommendation = z.infer<typeof jasonRecommendationSchema>;
export type OverallRecommendation = z.infer<typeof overallRecommendationSchema>;

export const analyzeToolTypes = [
  "affordability",
  "home-valuation",
  "offer-competitiveness",
  "market-prediction",
  "rent-vs-buy",
  "investment",
] as const;

export type AnalyzeToolType = (typeof analyzeToolTypes)[number];

export const analyzeRequestSchema = z.object({
  tool: z.enum(analyzeToolTypes),
  inputs: z.record(z.string(), z.unknown()),
  computedMetrics: z.record(z.string(), z.unknown()).optional(),
  context: z.string().max(2000).optional(),
});

/** JSON Schema for OpenAI Responses API strict structured output */
export const propertyAnalysisJsonSchema = {
  type: "object",
  properties: {
    disclaimer: { type: "string" },
    affordability: {
      type: "object",
      properties: {
        summary: { type: "string" },
        monthlyComfort: { type: "string" },
        stretchVsComfortable: { type: "string" },
        score: { type: "number" },
      },
      required: ["summary", "monthlyComfort", "stretchVsComfortable", "score"],
      additionalProperties: false,
    },
    risks: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              severity: { type: "string", enum: ["low", "medium", "high"] },
              detail: { type: "string" },
            },
            required: ["title", "severity", "detail"],
            additionalProperties: false,
          },
        },
      },
      required: ["items"],
      additionalProperties: false,
    },
    negotiation: {
      type: "object",
      properties: {
        ideas: { type: "array", items: { type: "string" } },
        leveragePoints: { type: "array", items: { type: "string" } },
      },
      required: ["ideas", "leveragePoints"],
      additionalProperties: false,
    },
    appreciation: {
      type: "object",
      properties: {
        outlook: { type: "string", enum: ["up", "flat", "down"] },
        projectedPercent12Mo: { type: "number" },
        summary: { type: "string" },
        factors: { type: "array", items: { type: "string" } },
      },
      required: ["outlook", "projectedPercent12Mo", "summary", "factors"],
      additionalProperties: false,
    },
    charts: {
      type: "object",
      properties: {
        affordabilityGauge: { type: "number" },
        riskScore: { type: "number" },
        appreciationOutlook: { type: "number" },
      },
      required: ["affordabilityGauge", "riskScore", "appreciationOutlook"],
      additionalProperties: false,
    },
    jasonRecommendation: {
      type: "object",
      properties: {
        personalRecommendation: { type: "string" },
        topRisks: {
          type: "array",
          items: { type: "string" },
          minItems: 3,
          maxItems: 3,
        },
        topOpportunities: {
          type: "array",
          items: { type: "string" },
          minItems: 3,
          maxItems: 3,
        },
        negotiationPoints: { type: "array", items: { type: "string" } },
        verifyBeforeContingencies: { type: "array", items: { type: "string" } },
        overall: {
          type: "string",
          enum: [
            "Strong Buy",
            "Good Opportunity",
            "Proceed with Caution",
            "Pass",
          ],
        },
      },
      required: [
        "personalRecommendation",
        "topRisks",
        "topOpportunities",
        "negotiationPoints",
        "verifyBeforeContingencies",
        "overall",
      ],
      additionalProperties: false,
    },
  },
  required: [
    "disclaimer",
    "affordability",
    "risks",
    "negotiation",
    "appreciation",
    "charts",
    "jasonRecommendation",
  ],
  additionalProperties: false,
} as const;
