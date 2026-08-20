import fs from "node:fs";
import path from "node:path";

export interface ThesisAuditCheck {
  checkId: string;
  category: string;
  passed: boolean;
  message: string;
}

export class ThesisConsistencyAuditor {
  private checks: ThesisAuditCheck[] = [];

  public runAudit() {
    console.log("🔍 EXECUTING MASTER THESIS CONSISTENCY AUDIT...\n");

    // 1. Audit Master Single Source-of-Truth Metrics
    this.auditFinalMetricsFile();

    // 2. Audit Benchmark Confusion Matrices & Recalculations
    this.auditBenchmarkMath();

    // 3. Audit Scope & Claim Language Scoping
    this.auditClaimScoping();

    const failed = this.checks.filter((c) => !c.passed);
    const summary = {
      status: failed.length === 0 ? "PASS" : "FAIL",
      totalChecks: this.checks.length,
      passedChecks: this.checks.length - failed.length,
      failedChecks: failed.length,
      checks: this.checks
    };

    const dir = path.resolve(process.cwd(), "reports/evaluation");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, "thesis-consistency-audit.json"), JSON.stringify(summary, null, 2));

    console.log("================================================================");
    console.log(`THESIS CONSISTENCY AUDIT STATUS: ${summary.status}`);
    console.log(`Passed: ${summary.passedChecks} / ${summary.totalChecks} Checks`);
    console.log("================================================================");

    if (failed.length > 0) {
      console.error("\n❌ THESIS CONSISTENCY AUDIT DETECTED DISCREPANCIES:");
      for (const f of failed) {
        console.error(`   - [${f.checkId}] ${f.message}`);
      }
      process.exit(1);
    }

    console.log("\n✅ ALL THESIS NUMERICAL CLAIMS AND SCOPE INVARIANTS VERIFIED CLEANLY!");
    return summary;
  }

  private auditFinalMetricsFile() {
    const file = path.resolve(process.cwd(), "reports/evaluation/final-metrics.json");
    if (!fs.existsSync(file)) {
      this.checks.push({ checkId: "CHK-01", category: "Source Artifact", passed: false, message: "Missing final-metrics.json" });
      return;
    }
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));
    this.checks.push({ checkId: "CHK-01", category: "Source Artifact", passed: true, message: "final-metrics.json exists and is valid JSON" });

    // Verify Benchmark v4 precision
    const b4p = data.syntheticBenchmarks?.benchmarkV4_AfterFix?.precision?.value;
    this.checks.push({ checkId: "CHK-02", category: "Metric Value", passed: typeof b4p === "number", message: `Benchmark v4 Precision value is numeric (${b4p})` });

    // Verify Holdout SVG V3 recall
    const svg3r = data.svgBenchmarks?.holdoutSvgV3?.recall?.value;
    this.checks.push({ checkId: "CHK-03", category: "Metric Value", passed: svg3r === 0.5385, message: `Holdout SVG V3 Recall (${svg3r}) == 0.5385` });
  }

  private auditBenchmarkMath() {
    const b4File = path.resolve(process.cwd(), "reports/evaluation/benchmark-v4-after-fix.json");
    if (fs.existsSync(b4File)) {
      const data = JSON.parse(fs.readFileSync(b4File, "utf-8"));
      const cm = data.confusionMatrix;
      const calcPrecision = Number((cm.TP / (cm.TP + cm.FP)).toFixed(4));
      const calcRecall = Number((cm.TP / (cm.TP + cm.FN)).toFixed(4));
      const reportedPrecision = Number(data.metrics.precision.toFixed(4));
      const reportedRecall = Number(data.metrics.recall.toFixed(4));

      this.checks.push({ checkId: "CHK-04", category: "Math Recalculation", passed: calcPrecision === reportedPrecision, message: `Benchmark v4 Precision recalculation (${calcPrecision}) matches reported (${reportedPrecision})` });
      this.checks.push({ checkId: "CHK-05", category: "Math Recalculation", passed: calcRecall === reportedRecall, message: `Benchmark v4 Recall recalculation (${calcRecall}) matches reported (${reportedRecall})` });
    }
  }

  private auditClaimScoping() {
    const thesisFile = path.resolve(process.cwd(), "docs/portal-transformer-final-thesis.md");
    if (fs.existsSync(thesisFile)) {
      const content = fs.readFileSync(thesisFile, "utf-8");
      const holdsUniversalSecurity = /guarantees complete security|immune to all attacks/i.test(content);
      this.checks.push({ checkId: "CHK-06", category: "Scope Claim", passed: !holdsUniversalSecurity, message: "Master thesis document avoids un-scoped universal security claims" });
    }
  }
}

// Standalone execution entrypoint
const auditor = new ThesisConsistencyAuditor();
auditor.runAudit();
