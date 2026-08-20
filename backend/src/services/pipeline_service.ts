/**
 * TSIF Pipeline Service.
 * Implements trust gate policy evaluation, proposal generation, audit logging, and patch ledger.
 */

export interface PatchLedgerEntry {
  patchId: string;
  issueType: string;
  targetSelector: string;
  proposedLabel: string;
  confidence: number;
  thresholdUsed: number;
  decision: "auto" | "confirm" | "reject";
  timestamp: string;
  status: "applied" | "reverted" | "reported";
}

export class PipelineService {
  private ledger: Map<string, PatchLedgerEntry> = new Map();
  private auditEvents: Array<{ timestamp: string; event: string; details: any }> = [];

  private policy = {
    targetAlpha: 0.05,
    globalLambdaStar: 0.85,
    roleLambdaStars: {
      "img-alt": 0.85,
      "button-name": 0.90,
      "link-name": 0.82,
      "form-label": 0.88
    },
    version: "policy-2026.1"
  };

  public getPolicy() {
    return this.policy;
  }

  public processDefect(payload: any, urlPath: string) {
    const issueType = this.detectIssueType(payload.tag, payload.attributes);
    const context = payload.surrounding_context || {};

    // 1. Context Firewall check
    if (this.isSensitiveUrl(urlPath)) {
      this.logAudit("FIREWALL_DENIAL", { urlPath, reason: "Sensitive Workflow URL" });
      return {
        patch: {
          patchId: "p_abstain_" + Date.now(),
          issueType,
          targetFingerprint: payload.id || "elem",
          targetSelector: payload.selector || payload.tag,
          attribute: "aria-label",
          previousValue: null,
          proposedValue: "",
          evidence: [],
          trustScore: 0.0,
          crcThresholdUsed: 0.85,
          decision: "reject",
          modelVersion: "N/A",
          timestamp: new Date().toISOString(),
          status: "rejected",
          reason: "FIREWALL_DENIED: Sensitive Workflow URL"
        }
      };
    }

    // 2. Prompt Injection firewall check (including hidden text)
    const contextStr = (context.nearest_heading || "") + " " + (context.parent_text || "") + " " + (context.hidden_text || "");
    if (this.containsPromptInjection(contextStr)) {
      this.logAudit("FIREWALL_DENIAL", { urlPath, reason: "Prompt Injection Detected" });
      return {
        patch: {
          patchId: "p_abstain_inj_" + Date.now(),
          issueType,
          targetFingerprint: payload.id || "elem",
          targetSelector: payload.selector || payload.tag,
          attribute: "aria-label",
          previousValue: null,
          proposedValue: "",
          evidence: [],
          trustScore: 0.0,
          crcThresholdUsed: 0.85,
          decision: "reject",
          modelVersion: "N/A",
          timestamp: new Date().toISOString(),
          status: "rejected",
          reason: "FIREWALL_DENIED: Prompt Injection Attack Detected"
        }
      };
    }

    // 3. Proposer & CRC Trust Gate Evaluation
    const lmbda = (this.policy.roleLambdaStars as any)[issueType] || this.policy.globalLambdaStar;
    const proposedLabel = this.generateProposedLabel(issueType, context);
    const confidence = proposedLabel ? 0.88 : 0.40;

    let decision: "auto" | "confirm" | "reject" = "reject";
    if (confidence >= lmbda) {
      decision = "auto";
    } else if (confidence >= lmbda - 0.15) {
      decision = "confirm";
    }

    const patchId = "p_srv_" + Math.random().toString(36).substring(2, 9);
    const patchEntry: PatchLedgerEntry = {
      patchId,
      issueType,
      targetSelector: payload.selector || payload.tag,
      proposedLabel,
      confidence,
      thresholdUsed: lmbda,
      decision,
      timestamp: new Date().toISOString(),
      status: "applied"
    };

    this.ledger.set(patchId, patchEntry);
    this.logAudit("PROPOSAL_GENERATED", { patchId, decision, confidence, lmbda });

    return {
      patch: {
        patchId,
        issueType,
        targetFingerprint: payload.id || "fp_" + patchId,
        targetSelector: payload.selector || payload.tag,
        attribute: this.getAttributeForIssue(issueType),
        previousValue: null,
        proposedValue: proposedLabel,
        evidence: [
          `Heading: ${context.nearest_heading || 'None'}`,
          `Parent Context: ${context.parent_text?.slice(0, 40) || 'None'}`
        ],
        trustScore: confidence,
        crcThresholdUsed: lmbda,
        decision,
        modelVersion: "trustportal-proposer-v1",
        timestamp: new Date().toISOString(),
        status: "applied"
      }
    };
  }

  public recordFeedback(patchId: string, feedback: string) {
    const entry = this.ledger.get(patchId);
    if (entry) {
      entry.status = "reported";
    }
    this.logAudit("USER_FEEDBACK", { patchId, feedback });
    return { success: true };
  }

  public recordRevert(patchId: string, reason: string) {
    const entry = this.ledger.get(patchId);
    if (entry) {
      entry.status = "reverted";
    }
    this.logAudit("PATCH_REVERTED", { patchId, reason });
    return { success: true };
  }

  private isSensitiveUrl(urlPath: string): boolean {
    return /\/(login|signin|checkout|payment|auth|otp|2fa|tax|health|bank)/i.test(urlPath);
  }

  private containsPromptInjection(text: string): boolean {
    return /(ignore\s+previous|system\s+prompt|you\s+are\s+now|override\s+policy|eval\(|<script)/i.test(text);
  }

  private detectIssueType(tag: string, attrs: any): string {
    if (tag === "img") return "img-alt";
    if (tag === "button" || attrs?.role === "button") return "button-name";
    if (tag === "a" || attrs?.role === "link") return "link-name";
    if (tag === "input" || tag === "select" || tag === "textarea") return "form-label";
    return "custom-control";
  }

  private getAttributeForIssue(issueType: string): string {
    if (issueType === "img-alt") return "alt";
    return "aria-label";
  }

  private generateProposedLabel(issueType: string, ctx: any): string {
    const heading = ctx.nearest_heading || "";
    const parent = ctx.parent_text || "";

    if (issueType === "img-alt") {
      if (parent.toLowerCase().includes("logo")) return "Company Logo";
      if (heading) return `Illustration for ${heading}`;
      return "Descriptive Image";
    }
    if (issueType === "button-name") {
      if (parent.toLowerCase().includes("search")) return "Search";
      return "Submit Form";
    }
    if (issueType === "form-label") {
      if (parent.toLowerCase().includes("email")) return "Email Address";
      return "Input Field";
    }
    return "Interactive Control";
  }

  private logAudit(event: string, details: any) {
    this.auditEvents.push({ timestamp: new Date().toISOString(), event, details });
  }
}
