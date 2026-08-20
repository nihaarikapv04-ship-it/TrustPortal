export interface IdempotencyRecord {
    key: string;
    response: any;
    createdAt: number;
    expiresAt: number;
}
export declare class IdempotencyStore {
    private store;
    private ttlMs;
    constructor(ttlSeconds?: number);
    get(key: string): IdempotencyRecord | undefined;
    set(key: string, response: any): void;
    clear(): void;
}
export declare const idempotencyStore: IdempotencyStore;
//# sourceMappingURL=idempotency.d.ts.map