// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from "vitest";
import { PatchLedger } from "../../../apps/extension/src/patches/patch_ledger.js";

describe("E2E Test: Proposal Reject Workflow", () => {
  let ledger: PatchLedger;
  let targetBtn: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    ledger = new PatchLedger();

    targetBtn = document.createElement("button");
    targetBtn.id = "unnamed-button";
    document.body.appendChild(targetBtn);
  });

  test("Rejecting proposal leaves DOM 100% unchanged and records rejection in ledger", () => {
    ledger.recordRejected("patch_reject_1", targetBtn);

    // Target element attribute MUST remain completely unchanged!
    expect(targetBtn.getAttribute("aria-label")).toBeNull();
    expect(ledger.getPatchStatus("patch_reject_1")).toBe("rejected");
  });
});
