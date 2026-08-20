import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../src/app";
describe("POST /v1/proposals Integration Test", () => {
    let app;
    beforeAll(async () => {
        app = buildApp();
        await app.ready();
    });
    afterAll(async () => {
        await app.close();
    });
    const validProposalRequest = {
        schemaVersion: "1.0.0",
        origin: "https://seva.gov.in",
        coarsePageCategory: "public-information",
        issueType: "img-alt",
        targetRole: "img",
        safeContext: {
            issueType: "img-alt",
            ruleId: "RULE_IMG_ALT_MISSING",
            elementRole: "img",
            safeAttributes: { src: "/hero.png" },
            visibleElementText: "",
            associatedLabel: "",
            nearestHeading: "Rural Housing Scheme",
            nearestLandmark: "main",
            boundedNearbyText: "Download application guidelines",
            urlOrigin: "https://seva.gov.in/housing",
            coarsePageCategory: "public-information",
            language: "en",
            redactionFlags: []
        },
        language: "en",
        privacyFlags: [],
        clientVersion: "1.0.0",
        idempotencyKey: "idemp_test_101"
    };
    test("Valid proposal request returns decision='abstain' stub response", async () => {
        const res = await app.inject({
            method: "POST",
            url: "/v1/proposals",
            headers: {
                "content-type": "application/json",
                origin: "http://localhost:5173"
            },
            payload: validProposalRequest
        });
        expect(res.statusCode).toBe(200);
        const body = JSON.parse(res.body);
        expect(body.action).toBe("abstain");
        expect(body.decision).toBe("reject");
        expect(body.trustScore).toBe(0);
        expect(body.modelMetadata.provider).toBe("none");
        expect(body.modelMetadata.promptVersion).toBe("backend-stub");
    });
    test("Rejects malformed JSON request with HTTP 400", async () => {
        const res = await app.inject({
            method: "POST",
            url: "/v1/proposals",
            headers: {
                "content-type": "application/json",
                origin: "http://localhost:5173"
            },
            payload: { invalidSchema: true }
        });
        expect(res.statusCode).toBe(400);
        const body = JSON.parse(res.body);
        expect(body.error.code).toBe("INVALID_REQUEST");
    });
});
