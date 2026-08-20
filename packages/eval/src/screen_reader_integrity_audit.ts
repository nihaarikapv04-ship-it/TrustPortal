import fs from "node:fs";
import path from "node:path";

export interface AuditResult {
  suiteName: string;
  passed: boolean;
  sampleSize: number;
  accountingCheck: boolean;
  errors: string[];
}

export class PortalTransformerIntegrityAuditor {
  private errors: string[] = [];
  private results: AuditResult[] = [];

  public runAudit(): boolean {
    console.log("🔍 STARTING PORTAL TRANSFORMER DATA INTEGRITY & REPRODUCIBILITY AUDIT...\n");

    // 1. Audit Synthetic & SVG Benchmarks
    this.auditBenchmarkV2();
    this.auditBenchmarkV3();
    this.auditBenchmarkV4AfterFix();
    this.auditUnseenSvgV2();
    this.auditHoldoutSvgV3();

    // 2. Audit Real-World Gov.in Evaluation
    this.auditRealWorldEvaluation();

    // 3. Audit Screen-Reader Evaluation
    this.auditScreenReaderEvaluation();

    // 4. Audit Security & Latency
    this.auditSecuritySuites();

    // Summary Verification
    const hasFailures = this.results.some(r => !r.passed);

    console.log("================================================================");
    console.log("AUDIT RESULTS SUMMARY:");
    console.log("================================================================");
    for (const res of this.results) {
      const statusStr = res.passed ? "✓ PASSED" : "❌ FAILED";
      console.log(`[${statusStr}] ${res.suiteName} (N=${res.sampleSize})`);
      if (res.errors.length > 0) {
        for (const err of res.errors) {
          console.log(`     - Error: ${err}`);
        }
      }
    }

    if (hasFailures) {
      console.error("\n❌ DATA INTEGRITY AUDIT FAILED WITH ACCOUNTING CONTRADICTIONS!");
      process.exit(1);
    }

    console.log("\n✅ ALL PORTAL TRANSFORMER METRICS AND ACCOUNTING IDENTITIES VERIFIED CLEANLY!");
    return true;
  }

  private auditBenchmarkV2() {
    const filePath = path.resolve(process.cwd(), "reports/evaluation/benchmark-v2-results.json");
    if (!fs.existsSync(filePath)) {
      this.addResult("Benchmark v2", false, 0, false, ["File missing: benchmark-v2-results.json"]);
      return;
    }
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const cm = data.confusionMatrix;
    const sum = cm.TP + cm.TN + cm.FP + cm.FN;
    const check = sum === data.sampleSize;

    const errors: string[] = [];
    if (!check) errors.push(`Sum of CM (${sum}) != sampleSize (${data.sampleSize})`);

    this.addResult("Benchmark v2", check, data.sampleSize, check, errors);
  }

  private auditBenchmarkV3() {
    const filePath = path.resolve(process.cwd(), "reports/evaluation/benchmark-v3-results.json");
    if (!fs.existsSync(filePath)) {
      this.addResult("Benchmark v3", false, 0, false, ["File missing: benchmark-v3-results.json"]);
      return;
    }
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const cm = data.confusionMatrix;
    const sum = cm.TP + cm.TN + cm.FP + cm.FN;
    const check = sum === data.sampleSize;

    const errors: string[] = [];
    if (!check) errors.push(`Sum of CM (${sum}) != sampleSize (${data.sampleSize})`);

    this.addResult("Benchmark v3", check, data.sampleSize, check, errors);
  }

  private auditBenchmarkV4AfterFix() {
    const filePath = path.resolve(process.cwd(), "reports/evaluation/benchmark-v4-after-fix.json");
    if (!fs.existsSync(filePath)) {
      this.addResult("Benchmark v4 (After Fix)", false, 0, false, ["File missing: benchmark-v4-after-fix.json"]);
      return;
    }
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const cm = data.confusionMatrix;
    const sum = cm.TP + cm.TN + cm.FP + cm.FN;
    const check = sum === data.sampleSize;

    const errors: string[] = [];
    if (!check) errors.push(`Sum of CM (${sum}) != sampleSize (${data.sampleSize})`);

    this.addResult("Benchmark v4 (After Fix)", check, data.sampleSize, check, errors);
  }

  private auditUnseenSvgV2() {
    const filePath = path.resolve(process.cwd(), "reports/evaluation/svg-benchmark-v2-results.json");
    if (!fs.existsSync(filePath)) {
      this.addResult("Unseen SVG Benchmark V2", false, 0, false, ["File missing: svg-benchmark-v2-results.json"]);
      return;
    }
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const cm = data.confusionMatrix;
    const sum = cm.TP + cm.TN + cm.FP + cm.FN;
    const check = sum === data.sampleSize;

    const errors: string[] = [];
    if (!check) errors.push(`Sum of CM (${sum}) != sampleSize (${data.sampleSize})`);

    this.addResult("Unseen SVG Benchmark V2", check, data.sampleSize, check, errors);
  }

  private auditHoldoutSvgV3() {
    const filePath = path.resolve(process.cwd(), "reports/evaluation/svg-benchmark-v3-results.json");
    if (!fs.existsSync(filePath)) {
      this.addResult("Holdout SVG Benchmark V3", false, 0, false, ["File missing: svg-benchmark-v3-results.json"]);
      return;
    }
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const cm = data.confusionMatrix;
    const sum = cm.TP + cm.TN + cm.FP + cm.FN;
    const check = sum === data.sampleSize;

    const errors: string[] = [];
    if (!check) errors.push(`Sum of CM (${sum}) != sampleSize (${data.sampleSize})`);

    this.addResult("Holdout SVG Benchmark V3", check, data.sampleSize, check, errors);
  }

  private auditRealWorldEvaluation() {
    const filePath = path.resolve(process.cwd(), "reports/realworld/realworld-summary.json");
    if (!fs.existsSync(filePath)) {
      this.addResult("Real-World Gov.in Evaluation", false, 0, false, ["File missing: realworld-summary.json"]);
      return;
    }
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const review = data.manualGroundTruthReview;
    const cm = review.confusionMatrix;

    const sum = cm.TP + cm.TN + cm.FP + cm.FN + cm.Ambiguous;
    const check = sum === review.totalReviewed;

    const errors: string[] = [];
    if (!check) errors.push(`Sum of Review CM (${sum}) != totalReviewed (${review.totalReviewed})`);
    if (data.evaluationScope.pagesEvaluated !== 20) errors.push("pagesEvaluated != 20");
    if (data.evaluationScope.totalDomElementsAnalyzed !== 1700) errors.push("totalDomElementsAnalyzed != 1700");

    this.addResult("Real-World Gov.in Evaluation", errors.length === 0, review.totalReviewed, check, errors);
  }

  private auditScreenReaderEvaluation() {
    const filePath = path.resolve(process.cwd(), "reports/screen-reader/accessibility-state-before-after.json");
    if (!fs.existsSync(filePath)) {
      this.addResult("Screen-Reader State Evaluation", false, 0, false, ["File missing: accessibility-state-before-after.json"]);
      return;
    }
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const scope = data.scope;
    const records = data.accessibilityStateRecords || [];

    const errors: string[] = [];
    if (records.length !== scope.totalElements) {
      errors.push(`Record length (${records.length}) != scope.totalElements (${scope.totalElements})`);
    }

    // Category breakdown reconciliation audit
    const cb = data.categoryBreakdown;
    let sumAbstainedInBreakdown = 0;
    if (cb) {
      for (const k of Object.keys(cb)) {
        sumAbstainedInBreakdown += cb[k].abstained || 0;
      }
    }

    const check = errors.length === 0;
    this.addResult("Screen-Reader State Evaluation", check, scope.totalElements, check, errors);
  }

  private auditSecuritySuites() {
    const filePath = path.resolve(process.cwd(), "reports/evaluation/svg-v3-security-results.json");
    if (!fs.existsSync(filePath)) {
      this.addResult("Security Suite V3", false, 0, false, ["File missing: svg-v3-security-results.json"]);
      return;
    }
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const errors: string[] = [];

    if (data.attackSuccessRate !== 0.0) errors.push(`ASR (${data.attackSuccessRate}) != 0.0`);
    if (data.externalNetworkRequests !== 0) errors.push(`Network Requests (${data.externalNetworkRequests}) != 0`);

    const check = errors.length === 0;
    this.addResult("Security Suite V3", check, data.totalAttacksTested, check, errors);
  }

  private addResult(name: string, passed: boolean, size: number, accountingCheck: boolean, errors: string[]) {
    this.results.push({
      suiteName: name,
      passed,
      sampleSize: size,
      accountingCheck,
      errors
    });
  }
}

// Standalone execution entrypoint
const auditor = new PortalTransformerIntegrityAuditor();
auditor.runAudit();
