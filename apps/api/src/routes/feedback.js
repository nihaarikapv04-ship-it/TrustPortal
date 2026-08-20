import { FeedbackRequestSchema } from "@trustportal/schemas";
import { feedbackService } from "../services/feedback_service.js";
export async function feedbackRoutes(server) {
    server.post("/v1/feedback", async (request, reply) => {
        const parseResult = FeedbackRequestSchema.safeParse(request.body);
        if (!parseResult.success) {
            return reply.status(400).send({
                error: {
                    code: "INVALID_REQUEST",
                    message: "Feedback request schema validation failed",
                    details: parseResult.error.format(),
                    requestId: request.id
                }
            });
        }
        const result = feedbackService.recordFeedback(parseResult.data);
        return reply.status(200).send(result);
    });
}
