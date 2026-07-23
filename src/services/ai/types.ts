export type AiProviderId = "openai" | "anthropic" | "google";

export interface AiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AiCompletionRequest {
  model?: string;
  messages: AiMessage[];
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

export interface AiCompletionResponse {
  provider: AiProviderId | string;
  model: string;
  content: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export interface AiEmbeddingRequest {
  model?: string;
  input: string | string[];
}

export interface AiEmbeddingResponse {
  provider: AiProviderId | string;
  model: string;
  embeddings: number[][];
}

export interface AiProvider {
  readonly name: AiProviderId | string;
  complete(request: AiCompletionRequest): Promise<AiCompletionResponse>;
  embed?(request: AiEmbeddingRequest): Promise<AiEmbeddingResponse>;
}

export interface HomeValuationAiInput {
  address: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  condition?: string;
}

export interface HomeValuationAiResult {
  lowEstimate: number;
  highEstimate: number;
  confidence: "low" | "medium" | "high";
  summary: string;
  comparables?: string[];
}

export interface OfferCompetitivenessAiInput {
  address: string;
  listPrice: number;
  offerPrice: number;
  marketContext?: string;
}

export interface OfferCompetitivenessAiResult {
  score: number;
  strengths: string[];
  risks: string[];
  recommendations: string[];
}

export interface MarketPredictionAiInput {
  neighborhoodSlug: string;
  horizonMonths: number;
}

export interface MarketPredictionAiResult {
  direction: "up" | "flat" | "down";
  projectedChangePercent: number;
  summary: string;
  disclaimer: string;
}

export interface AiAnalysisService {
  estimateHomeValue(input: HomeValuationAiInput): Promise<HomeValuationAiResult>;
  scoreOffer(input: OfferCompetitivenessAiInput): Promise<OfferCompetitivenessAiResult>;
  predictMarket(input: MarketPredictionAiInput): Promise<MarketPredictionAiResult>;
}
