import { z } from "zod";

export const DISCLOSURE_BUCKET = "disclosure-packages";
export const MAX_DISCLOSURE_FILES = 10;
export const MAX_DISCLOSURE_FILE_MB = 20;
export const MAX_DISCLOSURE_FILE_BYTES = MAX_DISCLOSURE_FILE_MB * 1024 * 1024;

export const disclosureIntakeSchema = z.object({
  propertyAddress: z.string().min(3).max(300),
  fullName: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional().or(z.literal("")),
  preferredContact: z.enum(["email", "phone", "text"]).default("email"),
  offerDeadline: z.string().max(40).optional().or(z.literal("")),
  workingWithAgent: z.enum(["no", "yes", "exploring"]).default("no"),
  attentionNotes: z.string().max(4000).optional().or(z.literal("")),
  consent: z.literal(true),
  files: z
    .array(
      z.object({
        name: z.string().min(1).max(260),
        size: z.number().int().positive().max(MAX_DISCLOSURE_FILE_BYTES),
        contentType: z.string().optional(),
      }),
    )
    .min(1)
    .max(MAX_DISCLOSURE_FILES),
});

export type DisclosureIntake = z.infer<typeof disclosureIntakeSchema>;

export const disclosureFindingSchema = z.object({
  topic: z.string(),
  summary: z.string(),
  whyItMatters: z.string(),
  sourceDocument: z.string(),
  sourcePage: z.number().int().positive(),
  sourceType: z.enum([
    "seller",
    "inspector",
    "hoa",
    "other_document",
    "ai_interpretation",
  ]),
  followUpQuestion: z.string(),
});

export const disclosureDraftSchema = z.object({
  disclaimer: z.string(),
  overview: z.string(),
  importantFindings: z.array(disclosureFindingSchema).max(20),
  conflictingStatements: z
    .array(
      z.object({
        detail: z.string(),
        sources: z.array(z.string()).min(1).max(6),
      }),
    )
    .max(10),
  missingDocuments: z
    .array(
      z.object({
        referencedAs: z.string(),
        referencedInDocument: z.string(),
        referencedPage: z.number().int().positive(),
        followUpQuestion: z.string(),
      }),
    )
    .max(15),
  questionsForListingAgent: z.array(z.string()).max(15),
  questionsForSpecialists: z.array(z.string()).max(15),
  topicsCovered: z.array(z.string()).max(20),
  jasonReviewNotes: z.string(),
});

export type DisclosureDraft = z.infer<typeof disclosureDraftSchema>;

/** JSON Schema for OpenAI Responses API strict structured output */
export const disclosureDraftJsonSchema = {
  type: "object",
  properties: {
    disclaimer: { type: "string" },
    overview: { type: "string" },
    importantFindings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          topic: { type: "string" },
          summary: { type: "string" },
          whyItMatters: { type: "string" },
          sourceDocument: { type: "string" },
          sourcePage: { type: "number" },
          sourceType: {
            type: "string",
            enum: [
              "seller",
              "inspector",
              "hoa",
              "other_document",
              "ai_interpretation",
            ],
          },
          followUpQuestion: { type: "string" },
        },
        required: [
          "topic",
          "summary",
          "whyItMatters",
          "sourceDocument",
          "sourcePage",
          "sourceType",
          "followUpQuestion",
        ],
        additionalProperties: false,
      },
    },
    conflictingStatements: {
      type: "array",
      items: {
        type: "object",
        properties: {
          detail: { type: "string" },
          sources: { type: "array", items: { type: "string" } },
        },
        required: ["detail", "sources"],
        additionalProperties: false,
      },
    },
    missingDocuments: {
      type: "array",
      items: {
        type: "object",
        properties: {
          referencedAs: { type: "string" },
          referencedInDocument: { type: "string" },
          referencedPage: { type: "number" },
          followUpQuestion: { type: "string" },
        },
        required: [
          "referencedAs",
          "referencedInDocument",
          "referencedPage",
          "followUpQuestion",
        ],
        additionalProperties: false,
      },
    },
    questionsForListingAgent: { type: "array", items: { type: "string" } },
    questionsForSpecialists: { type: "array", items: { type: "string" } },
    topicsCovered: { type: "array", items: { type: "string" } },
    jasonReviewNotes: { type: "string" },
  },
  required: [
    "disclaimer",
    "overview",
    "importantFindings",
    "conflictingStatements",
    "missingDocuments",
    "questionsForListingAgent",
    "questionsForSpecialists",
    "topicsCovered",
    "jasonReviewNotes",
  ],
  additionalProperties: false,
} as const;
