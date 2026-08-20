import { describe, test, expect } from "vitest";
import { PIIRedactor } from "../src/redactor";

describe("PIIRedactor Unit Tests", () => {
  const redactor = new PIIRedactor();

  test("Redacts email addresses without leaking partial information", () => {
    const res = redactor.redact("Contact support at john.doe@example.com for help");
    expect(res.cleanText).toBe("Contact support at [REDACTED_EMAIL] for help");
    expect(res.redactionFlags).toContain("PII_EMAIL_REDACTED");
  });

  test("Redacts phone numbers", () => {
    const res = redactor.redact("Call +1 (555) 019-2834 immediately");
    expect(res.cleanText).toBe("Call [REDACTED_PHONE] immediately");
    expect(res.redactionFlags).toContain("PII_PHONE_REDACTED");
  });

  test("Redacts SSN / Aadhaar / PAN numbers", () => {
    const res = redactor.redact("PAN Card ABCDE1234F or Aadhaar 1234 5678 9012");
    expect(res.cleanText).toContain("[REDACTED_ID]");
    expect(res.redactionFlags).toContain("PII_ID_REDACTED");
  });

  test("Redacts security tokens and query string secrets", () => {
    const res = redactor.redact("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.secret");
    expect(res.cleanText).toBe("[REDACTED_TOKEN]");
    expect(res.redactionFlags).toContain("SECURITY_TOKEN_REDACTED");
  });
});
