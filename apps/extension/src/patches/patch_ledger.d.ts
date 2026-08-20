/**
 * Patch Ledger & Live Element State Tracking Engine.
 * Tracks lifecycle status of every semantic patch and maintains WeakMap references for live DOM state.
 */
import { SemanticPatch } from "@trustportal/schemas";
import { PatchStatus, PatchLedgerEntry } from "./patch_model.js";
export interface ElementState {
    patchId: string | null;
    status: PatchStatus;
    lastFingerprint: string;
}
export declare class PatchLedger {
    private ledger;
    private liveElementMap;
    /**
     * Registers a newly created or proposed patch.
     */
    registerProposal(patch: SemanticPatch): PatchLedgerEntry;
    recordProposed(patch: SemanticPatch, element?: Element): PatchLedgerEntry;
    recordInjected(patchId: string, element?: Element): boolean;
    recordConflict(patchId: string, element?: Element): boolean;
    recordReverted(patchId: string, element?: Element): boolean;
    recordRejected(patchId: string, element?: Element): boolean;
    getPatchStatus(patchId: string): PatchStatus | undefined;
    /**
     * Binds live Element reference to ElementState in WeakMap.
     */
    bindElementState(element: Element, patchId: string, status: PatchStatus, fingerprint: string): void;
    /**
     * Retrieves live ElementState from WeakMap.
     */
    getElementState(element: Element): ElementState | undefined;
    /**
     * Updates status of a patch in the ledger.
     */
    updateStatus(patchId: string, status: PatchStatus, reason?: string): boolean;
    /**
     * Retrieves a ledger entry by patch ID.
     */
    getEntry(patchId: string): PatchLedgerEntry | undefined;
    /**
     * Marks a patch as stale when target DOM changes.
     */
    markStale(patchId: string): void;
    /**
     * Returns all active ledger entries.
     */
    getAllEntries(): PatchLedgerEntry[];
    /**
     * Clears ledger state (used for testing).
     */
    clear(): void;
}
export declare const patchLedger: PatchLedger;
//# sourceMappingURL=patch_ledger.d.ts.map