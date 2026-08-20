import { ConfirmationViewModel } from "../messaging_types.js";
export interface PanelActions {
    onAccept: () => void;
    onEdit: (newLabel: string) => void;
    onReject: () => void;
    onUndo: () => void;
    onDismiss: () => void;
}
export declare class TrustPortalConfirmationPanel {
    private host;
    private shadow;
    private viewModel;
    private actions;
    private statusAnnouncer;
    constructor(shadowMode?: "open" | "closed");
    mount(targetContainer?: HTMLElement): void;
    unmount(): void;
    render(viewModel: ConfirmationViewModel, actions: PanelActions, mode?: "confirming" | "editing" | "applied" | "conflict"): void;
}
//# sourceMappingURL=confirmation_panel.d.ts.map