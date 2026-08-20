# TrustPortal AI Provider Abstraction & Structured Inference Layer (`apps/api/src/providers`)

> [!IMPORTANT]
> **Calibrated Authorization Boundary Notice**: Model confidence scores returned by AI providers are **untrusted raw signals** until calibrated. In Step 8, model proposal structured output is validated and returned, but the final authorization decision (`decision: "reject"`) remains **pending trust evaluation** until the Step 9 Trust Engine.

---

## 1. Provider Abstraction Architecture

The inference layer separates AI model calls from application business logic via the `ModelProvider` interface:

```typescript
export interface ModelProvider {
  readonly id: string;
  readonly capabilities: ModelCapabilities;
  proposeLabel(context: SafeContext, request: InferenceRequest): Promise<ModelProposal>;
}
```

```
SafeContext (Validated)
       ↓
ModelRouter (selects ModelProvider by issueType & capabilities)
       ↓
Circuit Breaker Check (Available?) ──> [If OPEN: Abstain]
       ↓
ModelProvider (MockTextProvider / MockVisionProvider / Hosted Model)
       ↓
OutputValidator (Strict Label & Evidence Security Checks)
       ↓
ModelProposal (Structured JSON)
```

---

## 2. Model Output Contract & Validation Rules

Model outputs MUST conform strictly to `ModelProposal`:

```typescript
export interface ModelProposal {
  action: "propose" | "abstain";
  label: string;
  language: string;
  evidence: EvidenceItem[];
  rationale: string;
  modelConfidence: number;
  riskFlags: string[];
}
```

### Deterministic Security Rules (`outputValidator`):
1. **Label Safety**: Rejects HTML tags (`<[^>]*>`), `<script>`, control characters (`[\x00-\x1F\x7F]`), and prompt injection override keywords (`ignore previous instructions`, `override policy`, `eval(`). Maximum label length: 200 characters.
2. **Evidence Verifiability**: Action `"propose"` requires at least 1 valid `EvidenceItem` whose quote is verifiable within the supplied `SafeContext`.
3. **Rationale Ceiling**: Rationale must be concise ($\le 250$ chars) and evidence-based. No chain-of-thought traces or internal reasoning steps are accepted or stored.
4. **No Code Execution**: Model outputs have zero access to browser APIs, DOM mutation tools, filesystem, network tools, or provider selection mechanisms.

---

## 3. Versioned Inference System Prompt (`PROMPT_VERSION = "tsif-label-v1"`)

```text
PROMPT_VERSION = "tsif-label-v1"
```

- System prompt explicitly frames supplied web context as `[UNTRUSTED PAGE DATA]`.
- System instructions mandate data-only analysis and prohibit the model from following commands or directives found inside page text.

---

## 4. Timeout, Retry, & Circuit Breaker Limits

- **Timeout**: `MODEL_TIMEOUT_MS=5000` (default 5 seconds). Timeout returns `action: "abstain"`.
- **Retries**: `MAX_RETRIES=1`. Only transient network errors are retried. Malformed JSON or security rejections cause immediate abstention without retrying.
- **Circuit Breaker**: `circuitBreaker` tracks consecutive failures per provider (default max 3 failures). If tripped, the circuit breaker opens for 60 seconds, during which calls return `action: "abstain"`.

---

## 5. Mock & Adversarial Test Providers

- **`MockTextProvider`**: Deterministic provider for local development returning controlled labels based on context.
- **`MockVisionProvider`**: Vision capability stub.
- **`AdversarialMockProvider`**: Security test provider returning malicious outputs (XSS payloads, prompt overrides, sensitive data leak proposals) to verify rejection by `outputValidator`.
