import { FastifyInstance } from "fastify";
import { policyService } from "../services/policy_service.js";

export async function policyRoutes(server: FastifyInstance) {
  server.get("/v1/policy", async (_request, reply) => {
    const policy = policyService.getPolicy();
    return reply.status(200).send(policy);
  });
}
