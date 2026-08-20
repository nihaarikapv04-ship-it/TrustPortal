import { SafeContext } from "@trustportal/schemas";
import { ModelProvider, ModelProposal, InferenceRequest } from "./types.js";
import { MockTextProvider, MockVisionProvider } from "./mock_provider.js";
import { PROMPT_VERSION } from "./prompts.js";
import { outputValidator } from "../security/output_validator.js";
import { circuitBreaker } from "./circuit_breaker.js";

export interface InferenceResult {
  proposal: ModelProposal;
  providerId: string;
  latencyMs: number;
  promptVersion: string;
}

export class ModelRouter {
  private providers: Map<string, ModelProvider> = new Map();
  private defaultTextProvider: ModelProvider;
  private defaultVisionProvider: ModelProvider;

  constructor(textProvider?: ModelProvider, visionProvider?: ModelProvider) {
    this.defaultTextProvider = textProvider || new MockTextProvider();
    this.defaultVisionProvider = visionProvider || new MockVisionProvider();

    this.registerProvider(this.defaultTextProvider);
    this.registerProvider(this.defaultVisionProvider);
  }

  public registerProvider(provider: ModelProvider): void {
    this.providers.set(provider.id, provider);
  }

  /**
   * Routes SafeContext to the appropriate ModelProvider with timeout, retry, and validation bounds.
   */
  public async routeAndInference(
    context: SafeContext,
    requestParams?: Partial<InferenceRequest>
  ): Promise<InferenceResult> {
    const startTime = Date.now();
    const req: InferenceRequest = {
      promptVersion: PROMPT_VERSION,
      maxTokens: 150,
      temperature: 0.2,
      timeoutMs: requestParams?.timeoutMs || 5000
    };

    // Provider Selection Strategy based strictly on trusted backend logic
    const provider = this.selectProvider(context);

    // Circuit Breaker Check
    if (!circuitBreaker.isAvailable(provider.id)) {
      return {
        proposal: {
          action: "abstain",
          label: "",
          language: context.language || "en",
          evidence: [],
          rationale: `Provider '${provider.id}' is currently unavailable (Circuit Breaker OPEN).`,
          modelConfidence: 0.0,
          riskFlags: ["provider-unavailable"]
        },
        providerId: provider.id,
        latencyMs: Date.now() - startTime,
        promptVersion: req.promptVersion
      };
    }

    // Execute Inference with Timeout & 1 Retry for transient errors
    let rawProposal: ModelProposal | null = null;
    let attempts = 0;
    const maxRetries = 1;

    while (attempts <= maxRetries && !rawProposal) {
      attempts++;
      try {
        rawProposal = await this.executeWithTimeout(provider, context, req);
        circuitBreaker.recordSuccess(provider.id);
      } catch (err: any) {
        console.warn(`Inference attempt ${attempts} failed for provider '${provider.id}': ${err.message}`);
        if (attempts > maxRetries) {
          circuitBreaker.recordFailure(provider.id);
        }
      }
    }

    const latencyMs = Date.now() - startTime;

    if (!rawProposal) {
      return {
        proposal: {
          action: "abstain",
          label: "",
          language: context.language || "en",
          evidence: [],
          rationale: "Inference timed out or failed transient execution.",
          modelConfidence: 0.0,
          riskFlags: ["inference-timeout"]
        },
        providerId: provider.id,
        latencyMs,
        promptVersion: req.promptVersion
      };
    }

    // Deterministic Output & Label Validation
    const valResult = outputValidator.validate(rawProposal, context);

    return {
      proposal: valResult.proposal,
      providerId: provider.id,
      latencyMs,
      promptVersion: req.promptVersion
    };
  }

  private selectProvider(context: SafeContext): ModelProvider {
    // If issue is img-alt and has no textual context, route to vision provider if available
    if (
      context.issueType === "img-alt" &&
      !context.visibleElementText &&
      !context.boundedNearbyText &&
      this.defaultVisionProvider.capabilities.vision
    ) {
      return this.defaultVisionProvider;
    }

    return this.defaultTextProvider;
  }

  private executeWithTimeout(
    provider: ModelProvider,
    context: SafeContext,
    req: InferenceRequest
  ): Promise<ModelProposal> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Model inference timed out after ${req.timeoutMs}ms`));
      }, req.timeoutMs);

      provider
        .proposeLabel(context, req)
        .then((res) => {
          clearTimeout(timer);
          resolve(res);
        })
        .catch((err) => {
          clearTimeout(timer);
          reject(err);
        });
    });
  }
}

export const modelRouter = new ModelRouter();
