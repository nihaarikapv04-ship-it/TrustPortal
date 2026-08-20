import { piiRedactor } from "@trustportal/redaction";
export class FeedbackService {
    feedbackStore = [];
    recordFeedback(request) {
        let safeCustomLabel = request.customLabel;
        // If edited label is provided, validate and redact safety
        if (request.action === "edit" && request.customLabel) {
            const redacted = piiRedactor.redact(request.customLabel);
            safeCustomLabel = redacted.cleanText;
        }
        const record = {
            ...request,
            customLabel: safeCustomLabel,
            receivedAt: new Date().toISOString()
        };
        this.feedbackStore.push(record);
        return { success: true, patchId: request.patchId };
    }
    getRecords() {
        return [...this.feedbackStore];
    }
    clear() {
        this.feedbackStore = [];
    }
}
export const feedbackService = new FeedbackService();
