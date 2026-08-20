import { ProviderHealth } from "./types.js";
export declare class ProviderCircuitBreaker {
    private healthMap;
    private maxFailures;
    private cooldownMs;
    constructor(maxFailures?: number, cooldownSeconds?: number);
    isAvailable(providerId: string): boolean;
    recordSuccess(providerId: string): void;
    recordFailure(providerId: string): void;
    getHealth(providerId: string): ProviderHealth;
}
export declare const circuitBreaker: ProviderCircuitBreaker;
//# sourceMappingURL=circuit_breaker.d.ts.map