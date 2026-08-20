import { ConfirmationViewModel } from "../messaging_types.js";
import { TrustPortalConfirmationPanel } from "./confirmation_panel.js";
import { PatchApplicator } from "../patches/patch_applicator.js";
import { PatchLedger } from "../patches/patch_ledger.js";
import { SemanticPatch } from "@trustportal/schemas";
import { computeTargetFingerprint } from "../patches/fingerprint.js";

export class PanelController {
  private panel: TrustPortalConfirmationPanel;
  private patchApplicator: PatchApplicator;
  private patchLedger: PatchLedger;
  private currentViewModel: ConfirmationViewModel | null = null;
  private currentTargetElement: Element | null = null;

  constructor(patchApplicator?: PatchApplicator, patchLedger?: PatchLedger) {
    this.panel = new TrustPortalConfirmationPanel("open");
    this.patchApplicator = patchApplicator || new PatchApplicator();
    this.patchLedger = patchLedger || new PatchLedger();
  }

  public showProposal(viewModel: ConfirmationViewModel, targetElement: Element): void {
    this.currentViewModel = viewModel;
    this.currentTargetElement = targetElement;
    this.panel.mount(document.body);

    this.panel.render(viewModel, {
      onAccept: () => this.handleAccept(viewModel.proposedValue),
      onEdit: (newLabel) => this.handleAccept(newLabel, true),
      onReject: () => this.handleReject(),
      onUndo: () => this.handleUndo(),
      onDismiss: () => this.panel.unmount()
    }, "confirming");
  }

  private handleAccept(proposedValue: string, isEdited: boolean = false): void {
    if (!this.currentViewModel || !this.currentTargetElement) return;

    // 1. Revalidate Target Existence & Fingerprint (Defense in Depth!)
    if (!document.body.contains(this.currentTargetElement)) {
      alert("This change could not be applied because the element was removed from the page.");
      this.panel.unmount();
      return;
    }

    const currentFp = computeTargetFingerprint(this.currentTargetElement, this.currentViewModel.issue.type);
    if (currentFp !== this.currentViewModel.target.fingerprint) {
      alert("This change could not be safely applied because the page changed.");
      this.panel.unmount();
      return;
    }

    // 2. Construct SemanticPatch Object
    const patch: SemanticPatch = {
      patchId: this.currentViewModel.patchId,
      issueType: this.currentViewModel.issue.type as any,
      targetFingerprint: currentFp,
      attribute: this.currentViewModel.target.attribute,
      previousValue: this.currentViewModel.target.previousValue,
      proposedValue: proposedValue.trim(),
      evidence: this.currentViewModel.evidence,
      trustScore: this.currentViewModel.trustScore,
      decision: this.currentViewModel.decision,
      modelVersion: "v1.0.0"
    };

    // 3. Call Step 4 PatchApplicator (NEVER mutate DOM directly!)
    const patchResult = this.patchApplicator.applyPatch(patch, this.currentTargetElement);

    if (!patchResult.success) {
      const errMsg = patchResult.details || patchResult.reason || "unknown error";
      alert(`Patch application failed: ${errMsg}`);
      return;
    }

    // 4. Update PatchLedger Status
    this.patchLedger.recordProposed(patch, this.currentTargetElement);
    this.patchLedger.recordInjected(patch.patchId, this.currentTargetElement);

    // 5. Render Applied State in UI
    this.currentViewModel.proposedValue = proposedValue;
    this.panel.render(this.currentViewModel, {
      onAccept: () => {},
      onEdit: () => {},
      onReject: () => {},
      onUndo: () => this.handleUndo(),
      onDismiss: () => this.panel.unmount()
    }, "applied");
  }

  private handleUndo(): void {
    if (!this.currentViewModel || !this.currentTargetElement) return;

    const patchId = this.currentViewModel.patchId;

    // Call Step 4 PatchApplicator Revert (Conflict-aware!)
    const revertResult = this.patchApplicator.revertPatch(patchId, this.currentTargetElement);

    if (!revertResult.success) {
      const detailsStr = revertResult.details || "";
      if (revertResult.reason === "conflict" || detailsStr.includes("modified externally")) {
        this.patchLedger.recordConflict(patchId, this.currentTargetElement);
        this.panel.render(this.currentViewModel, {
          onAccept: () => {},
          onEdit: () => {},
          onReject: () => {},
          onUndo: () => {},
          onDismiss: () => this.panel.unmount()
        }, "conflict");
        return;
      }
      alert(`Revert failed: ${detailsStr || revertResult.reason}`);
      return;
    }

    this.patchLedger.recordReverted(patchId, this.currentTargetElement);
    this.panel.unmount();
  }

  private handleReject(): void {
    if (this.currentViewModel && this.currentTargetElement) {
      this.patchLedger.recordRejected(this.currentViewModel.patchId, this.currentTargetElement);
    }
    this.panel.unmount();
  }
}

export const panelController = new PanelController();
