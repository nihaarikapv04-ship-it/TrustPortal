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

export class PatchLedger {
  private ledger: Map<string, PatchLedgerEntry> = new Map();
  private liveElementMap: WeakMap<Element, ElementState> = new WeakMap();

  /**
   * Registers a newly created or proposed patch.
   */
  public registerProposal(patch: SemanticPatch): PatchLedgerEntry {
    const entry: PatchLedgerEntry = {
      patch,
      status: "proposed",
      createdAt: new Date().toISOString()
    };
    this.ledger.set(patch.patchId, entry);
    return entry;
  }

  public recordProposed(patch: SemanticPatch, element?: Element): PatchLedgerEntry {
    const entry = this.registerProposal(patch);
    if (element) {
      this.bindElementState(element, patch.patchId, "proposed", patch.targetFingerprint);
    }
    return entry;
  }

  public recordInjected(patchId: string, element?: Element): boolean {
    const res = this.updateStatus(patchId, "injected");
    if (res && element) {
      const entry = this.getEntry(patchId);
      this.bindElementState(element, patchId, "injected", entry?.patch.targetFingerprint || "");
    }
    return res;
  }

  public recordConflict(patchId: string, element?: Element): boolean {
    const res = this.updateStatus(patchId, "conflict");
    if (res && element) {
      const entry = this.getEntry(patchId);
      this.bindElementState(element, patchId, "conflict", entry?.patch.targetFingerprint || "");
    }
    return res;
  }

  public recordReverted(patchId: string, element?: Element): boolean {
    const res = this.updateStatus(patchId, "reverted");
    if (res && element) {
      const entry = this.getEntry(patchId);
      this.bindElementState(element, patchId, "reverted", entry?.patch.targetFingerprint || "");
    }
    return res;
  }

  public recordRejected(patchId: string, element?: Element): boolean {
    const res = this.updateStatus(patchId, "rejected");
    if (res && element) {
      const entry = this.getEntry(patchId);
      this.bindElementState(element, patchId, "rejected", entry?.patch.targetFingerprint || "");
    }
    return res;
  }

  public getPatchStatus(patchId: string): PatchStatus | undefined {
    const entry = this.getEntry(patchId);
    return entry?.status;
  }

  /**
   * Binds live Element reference to ElementState in WeakMap.
   */
  public bindElementState(element: Element, patchId: string, status: PatchStatus, fingerprint: string): void {
    this.liveElementMap.set(element, {
      patchId,
      status,
      lastFingerprint: fingerprint
    });
  }

  /**
   * Retrieves live ElementState from WeakMap.
   */
  public getElementState(element: Element): ElementState | undefined {
    return this.liveElementMap.get(element);
  }

  /**
   * Updates status of a patch in the ledger.
   */
  public updateStatus(patchId: string, status: PatchStatus, reason?: string): boolean {
    const entry = this.ledger.get(patchId);
    if (!entry) return false;

    entry.status = status;
    const now = new Date().toISOString();

    if (status === "injected") {
      entry.injectedAt = now;
    } else if (status === "reverted") {
      entry.revertedAt = now;
    } else if (status === "rejected") {
      entry.rejectionReason = reason;
    }

    return true;
  }

  /**
   * Retrieves a ledger entry by patch ID.
   */
  public getEntry(patchId: string): PatchLedgerEntry | undefined {
    return this.ledger.get(patchId);
  }

  /**
   * Marks a patch as stale when target DOM changes.
   */
  public markStale(patchId: string): void {
    this.updateStatus(patchId, "stale");
  }

  /**
   * Returns all active ledger entries.
   */
  public getAllEntries(): PatchLedgerEntry[] {
    return Array.from(this.ledger.values());
  }

  /**
   * Clears ledger state (used for testing).
   */
  public clear(): void {
    this.ledger.clear();
  }
}

export const patchLedger = new PatchLedger();
