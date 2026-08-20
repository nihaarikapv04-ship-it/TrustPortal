import { ProposalRequestSchema } from "@trustportal/schemas";
import { proposalService } from "../services/proposal_service.js";
import { isValidOrigin } from "../security/origin_guard.js";
import { rateLimiter } from "../security/rate_limit.js";
export async function proposalRoutes(server) {
    server.post("/v1/proposals", async (request, reply) => {
        const origin = (request.headers["origin"] || request.headers["referer"] || "").toString();
        // 1. Rate Limiting Check
        const clientKey = origin || request.ip;
        if (!rateLimiter.isAllowed(clientKey)) {
            return reply.status(429).send({
                error: {
                    code: "RATE_LIMIT_EXCEEDED",
                    message: "Too many proposal requests. Please try again later.",
                    requestId: request.id
                }
            });
        }
        // 2. Conservative Origin Guard Check
        if (origin && !isValidOrigin(origin, true)) {
            return reply.status(403).send({
                error: {
                    code: "FORBIDDEN_ORIGIN",
                    message: "Invalid or unauthorized request origin.",
                    requestId: request.id
                }
            });
        }
        // 3. Zod Schema Validation
        const parseResult = ProposalRequestSchema.safeParse(request.body);
        if (!parseResult.success) {
            return reply.status(400).send({
                error: {
                    code: "INVALID_REQUEST",
                    message: "Proposal request schema validation failed",
                    details: parseResult.error.format(),
                    requestId: request.id
                }
            });
        }
        const proposalReq = parseResult.data;
        // 4. Process Proposal via ModelRouter Service
        const result = await proposalService.processProposal(proposalReq);
        return reply.status(200).send(result);
    });
}
