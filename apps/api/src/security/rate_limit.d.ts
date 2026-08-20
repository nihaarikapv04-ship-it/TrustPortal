export declare class RateLimiter {
    private requests;
    private maxRequests;
    private windowMs;
    constructor(maxRequests?: number, windowSeconds?: number);
    isAllowed(key: string): boolean;
    clear(): void;
}
export declare const rateLimiter: RateLimiter;
//# sourceMappingURL=rate_limit.d.ts.map