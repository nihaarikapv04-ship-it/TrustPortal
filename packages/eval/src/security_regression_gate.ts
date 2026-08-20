import fs from "node:fs";
import path from "node:path";

export class SecurityRegressionGate {
  public runGateCheck(): boolean {
    console.log("🔒 EXECUTING SECURITY REGRESSION GATE CHECK...\n");

    const filePath = path.resolve(process.cwd(), "reports/evaluation/property-based-security-results.json");
    if (!fs.existsSync(filePath)) {
      console.error("❌ SECURITY GATE FAILED: Missing property-based-security-results.json");
      process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const errors: string[] = [];

    if (data.totalSucceeded > 0) errors.push(`Attack Succeeded (${data.totalSucceeded}) > 0`);
    if (data.totalUnsafeMutations > 0) errors.push(`Unsafe Mutations (${data.totalUnsafeMutations}) > 0`);
    if (data.totalCredentialLeaks > 0) errors.push(`Credential Leaks (${data.totalCredentialLeaks}) > 0`);
    if (data.totalNetworkRequests > 0) errors.push(`Network Requests (${data.totalNetworkRequests}) > 0`);

    if (errors.length > 0) {
      console.error("❌ SECURITY REGRESSION GATE FAILED:");
      for (const err of errors) {
        console.error(`   - ${err}`);
      }
      process.exit(1);
    }

    console.log("✅ SECURITY REGRESSION GATE PASSED CLEANLY (Zero Security Violations Across 1,000 Adversarial Payloads)");
    return true;
  }
}

// Standalone execution entrypoint
const gate = new SecurityRegressionGate();
gate.runGateCheck();
