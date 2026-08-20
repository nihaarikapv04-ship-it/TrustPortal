import { describe, test, expect } from "vitest";
import { buildApp } from "../src/app.js";

describe("API Gateway Health Endpoint Tests", () => {
  test("GET /health returns HTTP 200 OK with operational status", async () => {
    const app = await buildApp();

    const response = await app.inject({
      method: "GET",
      url: "/health"
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.status).toBe("ok");
    expect(body.service).toBe("trustportal-api");
    expect(body.version).toBe("1.0.0");

    await app.close();
  });
});
