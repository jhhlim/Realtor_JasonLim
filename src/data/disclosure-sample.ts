export type SampleFindingTag =
  | "Worth a closer look"
  | "Good to know"
  | "Missing document";

export interface SampleFinding {
  id: string;
  tab: "electrical" | "moisture" | "documents";
  tabLabel: string;
  tag: SampleFindingTag;
  summary: string;
  whyItMatters: string;
  sourceDocument: string;
  sourcePage: number;
  followUpQuestion: string;
}

export const disclosureSampleFindings: SampleFinding[] = [
  {
    id: "electrical-panel",
    tab: "electrical",
    tabLabel: "Electrical",
    tag: "Worth a closer look",
    summary:
      "The inspector identifies an older electrical panel and recommends an electrician’s evaluation.",
    whyItMatters:
      "An older panel is not automatically a deal-breaker, but you want a licensed electrician’s opinion before you lock in an offer strategy — especially if replacement, insurance underwriting, or permitting could come into play.",
    sourceDocument: "Sample Home Inspection",
    sourcePage: 14,
    followUpQuestion:
      "Has an electrician evaluated the panel, and is that report available?",
  },
  {
    id: "moisture-staining",
    tab: "moisture",
    tabLabel: "Moisture",
    tag: "Worth a closer look",
    summary:
      "The inspector reports staining below a window and could not determine the source.",
    whyItMatters:
      "Unresolved moisture can point to a simple seal failure — or a larger weatherproofing issue. Clarifying the source and any repairs helps you decide whether to ask for credits, further inspection, or a walk-away.",
    sourceDocument: "Sample Home Inspection",
    sourcePage: 22,
    followUpQuestion:
      "Has the source been identified, and are there records of repairs?",
  },
  {
    id: "missing-pest",
    tab: "documents",
    tabLabel: "Documents",
    tag: "Missing document",
    summary:
      "The seller disclosure references a pest inspection that does not appear in the uploaded package.",
    whyItMatters:
      "A missing report is not a red flag by itself, but you will want to read it — and any clearance — before you write an offer or release contingencies.",
    sourceDocument: "Sample Seller Disclosure",
    sourcePage: 3,
    followUpQuestion:
      "Can we get the full pest report and any related clearance?",
  },
];

export const disclosureHowItWorks = [
  {
    step: 1,
    title: "Upload the package",
    description:
      "Share the disclosure PDFs for a home you’re considering — seller disclosures, inspections, HOA docs, and related reports.",
  },
  {
    step: 2,
    title: "Get an organized summary",
    description:
      "I’ll use an AI-assisted review to organize what the documents say, flag gaps, and draft questions worth asking — then I personally review before we talk.",
  },
  {
    step: 3,
    title: "Go through it with Jason",
    description:
      "We walk through the findings together so you know what to ask the listing agent, inspector, or specialist before you decide how to move forward.",
  },
] as const;
