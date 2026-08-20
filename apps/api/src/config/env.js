export function loadConfig() {
    return {
        nodeEnv: process.env.NODE_ENV || "development",
        port: Number(process.env.PORT) || 3000,
        host: process.env.HOST || "0.0.0.0",
        corsOrigins: process.env.CORS_ORIGINS
            ? process.env.CORS_ORIGINS.split(",")
            : ["http://localhost:5173", "http://127.0.0.1:5173"],
        requestBodyLimit: Number(process.env.REQUEST_BODY_LIMIT) || 102400, // 100 KB limit
        rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 100,
        idempotencyTtlSeconds: Number(process.env.IDEMPOTENCY_TTL_SECONDS) || 300,
        logLevel: process.env.LOG_LEVEL || "info"
    };
}
