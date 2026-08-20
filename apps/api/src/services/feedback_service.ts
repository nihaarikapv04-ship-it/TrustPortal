import { FeedbackRequest } from "@trustportal/schemas";
import { piiRedactor } from "@trustportal/redaction";

export interface FeedbackRecord extends FeedbackRequest {
  receivedAt: string;
}

export class FeedbackService {
  private feedbackStore: FeedbackRecord[] = [];

  public recordFeedback(request: FeedbackRequest): { success: boolean; patchId: string } {
    let safeCustomLabel = request.customLabel;

    // If edited label is provided, validate and redact safety
    if (request.action === "edit" && request.customLabel) {
      const redacted = piiRedactor.redact(request.customLabel);
      safeCustomLabel = redacted.cleanText;
    }

    const record: FeedbackRecord = {
      ...request,
      customLabel: safeCustomLabel,
      receivedAt: new Date().toISOString()
    };

    this.feedbackStore.push(record);
    return { success: true, patchId: request.patchId };
  }

  public getRecords(): FeedbackRecord[] {
    return [...this.feedbackStore];
  }

  public clear(): void {
    this.feedbackStore = [];
  }
}

export const feedbackService = new FeedbackService();
