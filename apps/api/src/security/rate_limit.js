export class RateLimiter {
    requests = new Map();
    maxRequests;
    windowMs;
    constructor(maxRequests = 100, windowSeconds = 60) {
        this.maxRequests = maxRequests;
        this.windowMs = windowSeconds * 1000;
    }
    isAllowed(key) {
        const now = Date.now();
        const timestamps = this.requests.get(key) || [];
        // Filter out timestamps outside window
        const validTimestamps = timestamps.filter((t) => now - t < this.windowMs);
        if (validTimestamps.length >= this.maxRequests) {
            this.requests.set(key, validTimestamps);
            return false;
        }
        validTimestamps.push(now);
        this.requests.set(key, validTimestamps);
        return true;
    }
    clear() {
        this.requests.clear();
    }
}
export const rateLimiter = new RateLimiter();
