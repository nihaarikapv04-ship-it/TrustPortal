import { describe, test, expect } from "vitest";
import { PolicyStorage } from "../src/policy/storage";

describe("Policy Storage Abstraction Tests", () => {
  test("Default state for any site is enabled (true)", async () => {
    const storage = new PolicyStorage();
    const isEnabled = await storage.isSiteEnabled("https://newsite.com");
    expect(isEnabled).toBe(true);
  });

  test("Toggles site enabled state to false and back to true", async () => {
    const storage = new PolicyStorage();
    const origin = "https://disableme.com";

    await storage.setSiteEnabled(origin, false);
    let status = await storage.getSiteStatus(origin);
    expect(status.enabled).toBe(false);

    await storage.setSiteEnabled(origin, true);
    status = await storage.getSiteStatus(origin);
    expect(status.enabled).toBe(true);
  });
});
