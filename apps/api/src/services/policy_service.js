export class PolicyService {
    getPolicy() {
        return {
            thresholds: {
                autoApplyMinScore: 90,
                confirmMinScore: 75,
                roleThresholds: {
                    "img-alt": 85,
                    "button-name": 90,
                    "link-name": 82,
                    "form-label": 88
                }
            },
            disabledIssueTypes: [
                "authentication",
                "payment",
                "identity",
                "health",
                "tax",
                "legal",
                "benefits"
            ],
            providerAvailability: {
                anthropic: false,
                openai: false,
                local: false
            },
            emergencyDenylist: []
        };
    }
}
export const policyService = new PolicyService();
