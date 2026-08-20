import { SafeContext, EvidenceItem } from "@trustportal/schemas";
import { ModelProposal } from "../providers/types.js";

const PROMPT_INJECTION_KEYWORDS = /(ignore\s+(?:previous|all|trustportal|policy|instructions|rules)|system\s+prompt|you\s+are\s+now|override\s+policy|change\s+href|malicious|eval\(|<script)/i;
const ALLOWED_EVIDENCE_SOURCES = new Set(["visible_text", "nearby_text", "heading", "role", "image"]);

export interface ValidationResult {
  valid: boolean;
  proposal: ModelProposal;
  reason?: string;
}

export class OutputValidator {
  /**
   * Performs deterministic validation of AI model proposal outputs.
   */
  public validate(rawProposal: any, context: SafeContext): ValidationResult {
    // 1. Structure Check
    if (!rawProposal || typeof rawProposal !== "object") {
      return this.reject("Model output is not a JSON object");
    }

    const action = rawProposal.action === "propose" ? "propose" : "abstain";
    const rawLabel = String(rawProposal.label || "").trim();
    const language = String(rawProposal.language || context.language || "en").trim();
    const rationale = String(rawProposal.rationale || "").trim();
    let modelConfidence = Number(rawProposal.modelConfidence) || 0.0;
    modelConfidence = Math.max(0.0, Math.min(1.0, modelConfidence));

    const riskFlags: string[] = Array.isArray(rawProposal.riskFlags)
      ? rawProposal.riskFlags.map((f: any) => String(f))
      : [];

    // 2. If Action is "abstain", Return Valid Abstention
    if (action === "abstain" || !rawLabel) {
      return {
        valid: true,
        proposal: {
          action: "abstain",
          label: "",
          language,
          evidence: [],
          rationale: rationale || "Model abstained due to insufficient evidence.",
          modelConfidence: 0.0,
          riskFlags: [...riskFlags, "model-abstained"]
        }
      };
    }

    // 3. Label Security Validation
    if (rawLabel.length > 200) {
      return this.reject("Proposed label exceeds maximum allowed length (200 chars)");
    }

    if (/<[^>]*>/.test(rawLabel)) {
      return this.reject("Proposed label contains HTML tags or executable markup");
    }

    if (/[\x00-\x1F\x7F]/.test(rawLabel)) {
      return this.reject("Proposed label contains illegal control characters");
    }

    if (PROMPT_INJECTION_KEYWORDS.test(rawLabel)) {
      return this.reject("Proposed label contains prompt injection or override keywords");
    }

    // 4. Evidence Validation
    const evidence: EvidenceItem[] = [];
    if (Array.isArray(rawProposal.evidence)) {
      for (const item of rawProposal.evidence) {
        if (item && typeof item === "object" && ALLOWED_EVIDENCE_SOURCES.has(item.source)) {
          const quote = String(item.quote || "").trim();
          if (quote && quote.length <= 150) {
            evidence.push({ source: item.source, quote });
          }
        }
      }
    }

    // Must have at least 1 valid evidence item if proposing a label
    if (evidence.length === 0) {
      return this.reject("Proposed label lacks required verifiable evidence items from SafeContext");
    }

    // 5. Rationale Validation (No Chain-of-Thought traces)
    if (rationale.length > 250) {
      return this.reject("Rationale exceeds maximum length or contains long internal reasoning traces");
    }

    return {
      valid: true,
      proposal: {
        action: "propose",
        label: rawLabel,
        language,
        evidence,
        rationale,
        modelConfidence,
        riskFlags
      }
    };
  }

  private reject(reason: string): ValidationResult {
    return {
      valid: false,
      reason,
      proposal: {
        action: "abstain",
        label: "",
        language: "en",
        evidence: [],
        rationale: `Validation Rejected: ${reason}`,
        modelConfidence: 0.0,
        riskFlags: ["validation-rejected"]
      }
    };
  }
}

export const outputValidator = new OutputValidator();
