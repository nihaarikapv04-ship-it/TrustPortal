/**
 * Patch Ledger & Live Element State Tracking Engine.
 * Tracks lifecycle status of every semantic patch and maintains WeakMap references for live DOM state.
 */
export class PatchLedger {
    ledger = new Map();
    liveElementMap = new WeakMap();
    /**
     * Registers a newly created or proposed patch.
     */
    registerProposal(patch) {
        const entry = {
            patch,
            status: "proposed",
            createdAt: new Date().toISOString()
        };
        this.ledger.set(patch.patchId, entry);
        return entry;
    }
    recordProposed(patch, element) {
        const entry = this.registerProposal(patch);
        if (element) {
            this.bindElementState(element, patch.patchId, "proposed", patch.targetFingerprint);
        }
        return entry;
    }
    recordInjected(patchId, element) {
        const res = this.updateStatus(patchId, "injected");
        if (res && element) {
            const entry = this.getEntry(patchId);
            this.bindElementState(element, patchId, "injected", entry?.patch.targetFingerprint || "");
        }
        return res;
    }
    recordConflict(patchId, element) {
        const res = this.updateStatus(patchId, "conflict");
        if (res && element) {
            const entry = this.getEntry(patchId);
            this.bindElementState(element, patchId, "conflict", entry?.patch.targetFingerprint || "");
        }
        return res;
    }
    recordReverted(patchId, element) {
        const res = this.updateStatus(patchId, "reverted");
        if (res && element) {
            const entry = this.getEntry(patchId);
            this.bindElementState(element, patchId, "reverted", entry?.patch.targetFingerprint || "");
        }
        return res;
    }
    recordRejected(patchId, element) {
        const res = this.updateStatus(patchId, "rejected");
        if (res && element) {
            const entry = this.getEntry(patchId);
            this.bindElementState(element, patchId, "rejected", entry?.patch.targetFingerprint || "");
        }
        return res;
    }
    getPatchStatus(patchId) {
        const entry = this.getEntry(patchId);
        return entry?.status;
    }
    /**
     * Binds live Element reference to ElementState in WeakMap.
     */
    bindElementState(element, patchId, status, fingerprint) {
        this.liveElementMap.set(element, {
            patchId,
            status,
            lastFingerprint: fingerprint
        });
    }
    /**
     * Retrieves live ElementState from WeakMap.
     */
    getElementState(element) {
        return this.liveElementMap.get(element);
    }
    /**
     * Updates status of a patch in the ledger.
     */
    updateStatus(patchId, status, reason) {
        const entry = this.ledger.get(patchId);
        if (!entry)
            return false;
        entry.status = status;
        const now = new Date().toISOString();
        if (status === "injected") {
            entry.injectedAt = now;
        }
        else if (status === "reverted") {
            entry.revertedAt = now;
        }
        else if (status === "rejected") {
            entry.rejectionReason = reason;
        }
        return true;
    }
    /**
     * Retrieves a ledger entry by patch ID.
     */
    getEntry(patchId) {
        return this.ledger.get(patchId);
    }
    /**
     * Marks a patch as stale when target DOM changes.
     */
    markStale(patchId) {
        this.updateStatus(patchId, "stale");
    }
    /**
     * Returns all active ledger entries.
     */
    getAllEntries() {
        return Array.from(this.ledger.values());
    }
    /**
     * Clears ledger state (used for testing).
     */
    clear() {
        this.ledger.clear();
    }
}
export const patchLedger = new PatchLedger();
