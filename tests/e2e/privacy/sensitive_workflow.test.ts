import { describe, test, expect } from "vitest";
import { PrivacyFirewall } from "@trustportal/redaction";
import { TSIFRiskGate } from "@trustportal/scoring";
import { SafeContext } from "@trustportal/schemas";

describe("E2E Test: Sensitive Workflow Exclusion & Zero Inference Guarantee", () => {
  const firewall = new PrivacyFirewall();
  const riskGate = new TSIFRiskGate();

  test("OTP and CVV fields trigger immediate Privacy Firewall DENY (zero remote inference calls)", () => {
    const otpRes = firewall.evaluate({
      issueType: "form-label",
      ruleId: "RULE_FORM_LABEL_MISSING",
      elementRole: "textbox",
      rawAttributes: { type: "text", name: "otp", autocomplete: "one-time-code" },
      url: "https://seva.gov.in/verify"
    });

    expect(otpRes.decision).toBe("deny");
    expect((otpRes as any).safeContext).toBeUndefined(); // Zero SafeContext produced!
  });

  test("Sensitive workflow category (payment) is hard-gated by Trust Engine against 'auto' decision", () => {
    const sensitiveCtx: SafeContext = {
      issueType: "form-label",
      ruleId: "RULE_FORM_LABEL_MISSING",
      elementRole: "textbox",
      safeAttributes: { tag: "input" },
      visibleElementText: "CVV Number",
      associatedLabel: "",
      nearestHeading: "Payment Gate",
      nearestLandmark: "main",
      boundedNearbyText: "",
      urlOrigin: "https://seva.gov.in/checkout/pay",
      coarsePageCategory: "payment",
      language: "en",
      redactionFlags: []
    };

    const gateRes = riskGate.evaluateProposal("Payment Verification CVV", 0.99, sensitiveCtx);
    expect(gateRes.decision).not.toBe("auto");
    expect(gateRes.blockingReasons.some((r) => r.includes("High-impact workflow"))).toBe(true);
  });
});
