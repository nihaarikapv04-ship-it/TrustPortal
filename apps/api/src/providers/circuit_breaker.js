export class ProviderCircuitBreaker {
    healthMap = new Map();
    maxFailures;
    cooldownMs;
    constructor(maxFailures = 3, cooldownSeconds = 60) {
        this.maxFailures = maxFailures;
        this.cooldownMs = cooldownSeconds * 1000;
    }
    isAvailable(providerId) {
        const health = this.getHealth(providerId);
        if (!health.available) {
            if (health.lastFailureAt && Date.now() - health.lastFailureAt.getTime() > this.cooldownMs) {
                // Cooldown period elapsed, reset health
                health.available = true;
                health.failureCount = 0;
                return true;
            }
            return false;
        }
        return true;
    }
    recordSuccess(providerId) {
        const health = this.getHealth(providerId);
        health.available = true;
        health.failureCount = 0;
    }
    recordFailure(providerId) {
        const health = this.getHealth(providerId);
        health.failureCount += 1;
        health.lastFailureAt = new Date();
        if (health.failureCount >= this.maxFailures) {
            health.available = false;
            console.warn(`⚠️ Circuit Breaker OPEN for provider '${providerId}' after ${health.failureCount} failures.`);
        }
    }
    getHealth(providerId) {
        if (!this.healthMap.has(providerId)) {
            this.healthMap.set(providerId, {
                providerId,
                available: true,
                failureCount: 0
            });
        }
        return this.healthMap.get(providerId);
    }
}
export const circuitBreaker = new ProviderCircuitBreaker();
