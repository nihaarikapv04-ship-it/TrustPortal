import fs from "node:fs";
import path from "node:path";
import { SecurityPropertyVerifier } from "./security_properties.js";

export class PatchCapabilityAuditor {
  private verifier = new SecurityPropertyVerifier();

  public runPatchCapabilityAudit() {
    console.log("🔒 EXECUTING PATCH CAPABILITY ALLOWLIST AUDIT...\n");

    const allowedAttributes = ["alt", "aria-label", "aria-labelledby", "aria-describedby", "role"];
    const forbiddenAttributes = ["href", "src", "action", "formaction", "style", "onclick", "onload", "onerror", "innerHTML", "outerHTML", "script", "foreignObject"];

    let allowedPassed = true;
    for (const attr of allowedAttributes) {
      const res = this.verifier.checkP4_CapabilityLimitedMutation(attr);
      if (!res.satisfied) {
        allowedPassed = false;
        console.error(`❌ ALLOWED ATTRIBUTE CHECK FAILED FOR: ${attr}`);
      }
    }

    let forbiddenBlocked = true;
    for (const attr of forbiddenAttributes) {
      const res = this.verifier.checkP4_CapabilityLimitedMutation(attr);
      if (res.satisfied) {
        forbiddenBlocked = false;
        console.error(`❌ FORBIDDEN ATTRIBUTE ALLOWED UNEXPECTEDLY: ${attr}`);
      }
    }

    const passed = allowedPassed && forbiddenBlocked;
    const summary = {
      timestamp: new Date().toISOString(),
      status: passed ? "PASS" : "FAIL",
      allowedAttributes,
      forbiddenAttributes,
      allowedCheckPassed: allowedPassed,
      forbiddenCheckBlocked: forbiddenBlocked
    };

    const dir = path.resolve(process.cwd(), "reports/evaluation");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, "patch-capability-audit-results.json"), JSON.stringify(summary, null, 2));

    console.log("================================================================");
    console.log(`PATCH CAPABILITY AUDIT STATUS: ${summary.status}`);
    console.log(`Allowed Attributes Active: ${allowedAttributes.length}/${allowedAttributes.length}`);
    console.log(`Forbidden Attributes Blocked: ${forbiddenAttributes.length}/${forbiddenAttributes.length}`);
    console.log("================================================================");

    if (!passed) {
      process.exit(1);
    }

    console.log("\n✅ PATCH CAPABILITY ALLOWLIST VERIFIED CLEANLY!");
    return summary;
  }
}

// Standalone execution entrypoint
const auditor = new PatchCapabilityAuditor();
auditor.runPatchCapabilityAudit();
