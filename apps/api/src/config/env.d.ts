export interface ApiConfig {
    nodeEnv: string;
    port: number;
    host: string;
    corsOrigins: string[];
    requestBodyLimit: number;
    rateLimitMax: number;
    idempotencyTtlSeconds: number;
    logLevel: string;
}
export declare function loadConfig(): ApiConfig;
//# sourceMappingURL=env.d.ts.map