import { ProviderHealth } from "./types.js";

export class ProviderCircuitBreaker {
  private healthMap: Map<string, ProviderHealth> = new Map();
  private maxFailures: number;
  private cooldownMs: number;

  constructor(maxFailures: number = 3, cooldownSeconds: number = 60) {
    this.maxFailures = maxFailures;
    this.cooldownMs = cooldownSeconds * 1000;
  }

  public isAvailable(providerId: string): boolean {
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

  public recordSuccess(providerId: string): void {
    const health = this.getHealth(providerId);
    health.available = true;
    health.failureCount = 0;
  }

  public recordFailure(providerId: string): void {
    const health = this.getHealth(providerId);
    health.failureCount += 1;
    health.lastFailureAt = new Date();

    if (health.failureCount >= this.maxFailures) {
      health.available = false;
      console.warn(`⚠️ Circuit Breaker OPEN for provider '${providerId}' after ${health.failureCount} failures.`);
    }
  }

  public getHealth(providerId: string): ProviderHealth {
    if (!this.healthMap.has(providerId)) {
      this.healthMap.set(providerId, {
        providerId,
        available: true,
        failureCount: 0
      });
    }
    return this.healthMap.get(providerId)!;
  }
}

export const circuitBreaker = new ProviderCircuitBreaker();
