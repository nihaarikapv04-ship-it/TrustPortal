import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../src/app";
describe("GET /health Endpoint Test", () => {
    let app;
    beforeAll(async () => {
        app = buildApp();
        await app.ready();
    });
    afterAll(async () => {
        await app.close();
    });
    test("Returns HTTP 200 with status ok and service name", async () => {
        const res = await app.inject({
            method: "GET",
            url: "/health"
        });
        expect(res.statusCode).toBe(200);
        const body = JSON.parse(res.body);
        expect(body.status).toBe("ok");
        expect(body.service).toBe("trustportal-api");
    });
});
