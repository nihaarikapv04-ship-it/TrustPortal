import { ConfirmationViewModel } from "../messaging_types.js";
import { PatchApplicator } from "../patches/patch_applicator.js";
import { PatchLedger } from "../patches/patch_ledger.js";
export declare class PanelController {
    private panel;
    private patchApplicator;
    private patchLedger;
    private currentViewModel;
    private currentTargetElement;
    constructor(patchApplicator?: PatchApplicator, patchLedger?: PatchLedger);
    showProposal(viewModel: ConfirmationViewModel, targetElement: Element): void;
    private handleAccept;
    private handleUndo;
    private handleReject;
}
export declare const panelController: PanelController;
//# sourceMappingURL=panel_controller.d.ts.map