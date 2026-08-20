import { FastifyInstance } from "fastify";
import { DefectPayloadSchema, FeedbackSchema, RevertSchema } from "../schemas/api_schemas.js";
import { PipelineService } from "../services/pipeline_service.js";

export async function registerV1Routes(fastify: FastifyInstance, pipelineService: PipelineService) {
  // GET /v1/health
  fastify.get("/v1/health", async () => {
    return {
      status: "ok",
      service: "TrustPortal TSIF API",
      timestamp: new Date().toISOString()
    };
  });

  // GET /v1/policy
  fastify.get("/v1/policy", async () => {
    return pipelineService.getPolicy();
  });

  // POST /v1/proposals
  fastify.post("/v1/proposals", async (request, reply) => {
    const parseResult = DefectPayloadSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: "Invalid request schema", details: parseResult.error.format() });
    }

    const { payload, urlPath } = parseResult.data;
    const result = pipelineService.processDefect(payload, urlPath);
    return result;
  });

  // POST /v1/feedback
  fastify.post("/v1/feedback", async (request, reply) => {
    const parseResult = FeedbackSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: "Invalid feedback schema", details: parseResult.error.format() });
    }

    const { patchId, feedback } = parseResult.data;
    return pipelineService.recordFeedback(patchId, feedback);
  });

  // POST /v1/revert
  fastify.post("/v1/revert", async (request, reply) => {
    const parseResult = RevertSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ error: "Invalid revert schema", details: parseResult.error.format() });
    }

    const { patchId, reason } = parseResult.data;
    return pipelineService.recordRevert(patchId, reason);
  });
}
