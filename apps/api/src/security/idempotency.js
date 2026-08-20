export class IdempotencyStore {
  constructor(ttlSeconds = 300) {
    this.storeMap = new Map();
    this.ttlMs = ttlSeconds * 1000;
  }

  get(key) {
    const record = this.storeMap.get(key);
    if (!record) return null;

    if (Date.now() > record.expiresAt) {
      this.storeMap.delete(key);
      return null;
    }

    return record.response;
  }

  set(key, response) {
    const now = Date.now();
    this.storeMap.set(key, {
      key,
      response,
      createdAt: now,
      expiresAt: now + this.ttlMs
    });
  }

  store(key, response) {
    this.set(key, response);
  }

  clear() {
    this.storeMap.clear();
  }
}

export const idempotencyStore = new IdempotencyStore();
