export interface IdempotencyRecord {
  key: string;
  response: any;
  createdAt: number;
  expiresAt: number;
}

export class IdempotencyStore {
  private storeMap: Map<string, IdempotencyRecord> = new Map();
  private ttlMs: number;

  constructor(ttlSeconds: number = 300) {
    this.ttlMs = ttlSeconds * 1000;
  }

  public get(key: string): any | null {
    const record = this.storeMap.get(key);
    if (!record) return null;

    if (Date.now() > record.expiresAt) {
      this.storeMap.delete(key);
      return null;
    }

    return record.response;
  }

  public set(key: string, response: any): void {
    const now = Date.now();
    this.storeMap.set(key, {
      key,
      response,
      createdAt: now,
      expiresAt: now + this.ttlMs
    });
  }

  public store(key: string, response: any): void {
    this.set(key, response);
  }

  public clear(): void {
    this.storeMap.clear();
  }
}

export const idempotencyStore = new IdempotencyStore();
