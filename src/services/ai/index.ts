import type {
  AiAnalysisService,
  AiCompletionRequest,
  AiCompletionResponse,
  AiEmbeddingRequest,
  AiEmbeddingResponse,
  AiProvider,
  AiProviderId,
  HomeValuationAiInput,
  HomeValuationAiResult,
  MarketPredictionAiInput,
  MarketPredictionAiResult,
  OfferCompetitivenessAiInput,
  OfferCompetitivenessAiResult,
} from "@/services/ai/types";

export type {
  AiAnalysisService,
  AiCompletionRequest,
  AiCompletionResponse,
  AiEmbeddingRequest,
  AiEmbeddingResponse,
  AiMessage,
  AiProvider,
  AiProviderId,
  HomeValuationAiInput,
  HomeValuationAiResult,
  MarketPredictionAiInput,
  MarketPredictionAiResult,
  OfferCompetitivenessAiInput,
  OfferCompetitivenessAiResult,
} from "@/services/ai/types";

abstract class StubAiProvider implements AiProvider {
  abstract readonly name: AiProviderId;
  protected abstract envHint: string;

  protected notConfigured(): never {
    throw new Error(`Not configured: set ${this.envHint} for ${this.name}`);
  }

  async complete(_request: AiCompletionRequest): Promise<AiCompletionResponse> {
    this.notConfigured();
  }

  async embed(_request: AiEmbeddingRequest): Promise<AiEmbeddingResponse> {
    this.notConfigured();
  }
}

export class OpenAiProvider extends StubAiProvider {
  readonly name = "openai" as const;
  protected envHint = "OPENAI_API_KEY";
}

export class AnthropicProvider extends StubAiProvider {
  readonly name = "anthropic" as const;
  protected envHint = "ANTHROPIC_API_KEY";
}

export class GoogleAiProvider extends StubAiProvider {
  readonly name = "google" as const;
  protected envHint = "GOOGLE_GENERATIVE_AI_API_KEY";
}

export function getAiProvider(providerId?: AiProviderId): AiProvider {
  const id =
    providerId ??
    (process.env.AI_PROVIDER as AiProviderId | undefined);

  if (!id) {
    throw new Error("Not configured: set AI_PROVIDER to select an AI adapter");
  }

  switch (id) {
    case "openai":
      return new OpenAiProvider();
    case "anthropic":
      return new AnthropicProvider();
    case "google":
      return new GoogleAiProvider();
    default:
      throw new Error(`Not configured: unknown AI_PROVIDER "${String(id)}"`);
  }
}

/** Future-ready analysis facade — routes to configured provider when wired. */
export class StubAiAnalysisService implements AiAnalysisService {
  async estimateHomeValue(_input: HomeValuationAiInput): Promise<HomeValuationAiResult> {
    throw new Error(
      "Not configured: AI home valuation requires AI_PROVIDER and provider API keys",
    );
  }

  async scoreOffer(_input: OfferCompetitivenessAiInput): Promise<OfferCompetitivenessAiResult> {
    throw new Error(
      "Not configured: AI offer scoring requires AI_PROVIDER and provider API keys",
    );
  }

  async predictMarket(_input: MarketPredictionAiInput): Promise<MarketPredictionAiResult> {
    throw new Error(
      "Not configured: AI market prediction requires AI_PROVIDER and provider API keys",
    );
  }
}

export function getAiAnalysisService(): AiAnalysisService {
  return new StubAiAnalysisService();
}

export { createStructuredPropertyAnalysis } from "@/services/ai/openai-responses-client";
