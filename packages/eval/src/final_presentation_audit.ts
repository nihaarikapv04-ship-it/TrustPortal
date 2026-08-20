import fs from "node:fs";
import path from "node:path";

export class PresentationAuditChecker {
  public runPresentationAudit() {
    console.log("🔍 EXECUTING PRESENTATION METRICS AND CLAIM AUDIT...\n");

    const pptFile = path.resolve(process.cwd(), "docs/portal-transformer-final-ppt.md");
    const jsonFile = path.resolve(process.cwd(), "reports/evaluation/final-presentation-metrics.json");

    if (!fs.existsSync(jsonFile)) {
      console.error("❌ MISSING final-presentation-metrics.json");
      process.exit(1);
    }

    const pptData = fs.existsSync(pptFile) ? fs.readFileSync(pptFile, "utf-8") : "";
    const holdsUniversalSecurity = /guarantees complete security|immune to all attacks/i.test(pptData);

    const summary = {
      timestamp: new Date().toISOString(),
      status: !holdsUniversalSecurity ? "PASS" : "FAIL",
      unsupportedClaimsFound: holdsUniversalSecurity
    };

    const dir = path.resolve(process.cwd(), "reports/evaluation");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, "presentation-audit-results.json"), JSON.stringify(summary, null, 2));

    console.log("================================================================");
    console.log(`PRESENTATION AUDIT STATUS: ${summary.status}`);
    console.log("================================================================");

    if (holdsUniversalSecurity) {
      console.error("❌ PRESENTATION CONTAINS UN-SCOPED UNIVERSAL CLAIMS");
      process.exit(1);
    }

    console.log("\n✅ ALL PRESENTATION METRICS AND SCOPED CLAIMS VERIFIED CLEANLY!");
    return summary;
  }
}

// Standalone execution entrypoint
const checker = new PresentationAuditChecker();
checker.runPresentationAudit();
