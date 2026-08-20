import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { loadConfig } from "./config/env.js";
import { healthRoutes } from "./routes/health.js";
import { proposalRoutes } from "./routes/proposals.js";
import { feedbackRoutes } from "./routes/feedback.js";
import { policyRoutes } from "./routes/policy.js";

export function buildApp(): FastifyInstance {
  const config = loadConfig();

  const server = Fastify({
    logger: {
      level: config.logLevel,
      // Redact sensitive headers & parameters from logs!
      redact: ["req.headers.authorization", "req.headers.cookie", "req.body.safeContext"]
    },
    bodyLimit: config.requestBodyLimit, // Enforce strict 100KB request body limit
    requestIdHeader: "x-request-id"
  });

  // Configure CORS safely for extension & demo origins
  server.register(cors, {
    origin: (origin, cb) => {
      // Allow requests with no origin (e.g. mobile apps, curl) or allowed origins
      if (!origin || config.corsOrigins.includes(origin) || origin.startsWith("chrome-extension://")) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    },
    methods: ["GET", "POST", "OPTIONS"]
  });

  // Register API Routes
  server.register(healthRoutes);
  server.register(proposalRoutes);
  server.register(feedbackRoutes);
  server.register(policyRoutes);

  // Custom Error Handler
  server.setErrorHandler((error, request, reply) => {
    server.log.error(`API Error [Req: ${request.id}]: ${error.message}`);
    const statusCode = error.statusCode || 500;
    reply.status(statusCode).send({
      error: {
        code: error.code || "INTERNAL_SERVER_ERROR",
        message: statusCode === 500 ? "An unexpected server error occurred." : error.message,
        requestId: request.id
      }
    });
  });

  return server;
}
