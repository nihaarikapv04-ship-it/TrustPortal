import { FeedbackRequest } from "@trustportal/schemas";
export interface FeedbackRecord extends FeedbackRequest {
    receivedAt: string;
}
export declare class FeedbackService {
    private feedbackStore;
    recordFeedback(request: FeedbackRequest): {
        success: boolean;
        patchId: string;
    };
    getRecords(): FeedbackRecord[];
    clear(): void;
}
export declare const feedbackService: FeedbackService;
//# sourceMappingURL=feedback_service.d.ts.map