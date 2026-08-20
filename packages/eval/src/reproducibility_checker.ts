import fs from "node:fs";
import path from "node:path";
import { DeterministicDetector } from "@trustportal/rules";
import { generateGovInBaselineSnapshots } from "./realworld/snapshot_generator.js";

export class ReproducibilityChecker {
  public runReproducibilityAudit() {
    console.log("🔄 EXECUTING 3-RUN INDEPENDENT REPRODUCIBILITY AUDIT...\n");

    const detector = new DeterministicDetector();
    const runCounts: number[] = [];

    for (let run = 1; run <= 3; run++) {
      const snapshots = generateGovInBaselineSnapshots();
      let candidatesCount = 0;
      for (const snap of snapshots) {
        const cands = detector.scan(snap.elements);
        candidatesCount += cands.length;
      }
      runCounts.push(candidatesCount);
    }

    const isIdentical = runCounts[0] === runCounts[1] && runCounts[1] === runCounts[2];

    const summary = {
      timestamp: new Date().toISOString(),
      runsExecuted: 3,
      runCounts,
      isIdentical,
      reproducibilityClassification: isIdentical ? "DETERMINISTIC" : "NON_DETERMINISTIC"
    };

    const dir = path.resolve(process.cwd(), "reports/evaluation");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, "reproducibility-results.json"), JSON.stringify(summary, null, 2));

    console.log(`REPRODUCIBILITY AUDIT COMPLETE (Runs: ${runCounts.join(", ")} - ${summary.reproducibilityClassification})`);
    return summary;
  }
}

// Standalone execution entrypoint
const checker = new ReproducibilityChecker();
checker.runReproducibilityAudit();
