import { describe, test, expect } from "vitest";
import { SyntheticQRDecoder } from "../src/qr/decoder.js";
import { PaymentPayloadParser } from "../src/qr/parser.js";
import { SYNTHETIC_QR_FIXTURES } from "../src/scenarios/fixtures.js";

describe("TrustQR Phase B: QR Decoder, Parser & Schema Unit Tests", () => {
  const decoder = new SyntheticQRDecoder();
  const parser = new PaymentPayloadParser();

  test("1. Valid UPI payload parsing extracts recipient, amount, merchant, and currency", async () => {
    const fixture = SYNTHETIC_QR_FIXTURES.NORMAL_PAYMENT;
    const decoded = await decoder.decode(fixture.rawPayload);
    const result = parser.parse(decoded);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.scheme).toBe("upi");
      expect(result.data.recipient).toBe("abc@upi");
      expect(result.data.merchantName).toBe("ABC Electronics");
      expect(result.data.amount).toBe(2500);
      expect(result.data.currency).toBe("INR");
      expect(result.data.transactionRef).toBe("REF123456");
    }
  });

  test("2. URL-encoded merchant name is correctly decoded", async () => {
    const fixture = SYNTHETIC_QR_FIXTURES.ENCODED_MERCHANT;
    const decoded = await decoder.decode(fixture.rawPayload);
    const result = parser.parse(decoded);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.merchantName).toBe("SevaConnect Public Store");
    }
  });

  test("3. Missing payee address ('pa') fails closed with MISSING_RECIPIENT", async () => {
    const fixture = SYNTHETIC_QR_FIXTURES.MISSING_RECIPIENT;
    const decoded = await decoder.decode(fixture.rawPayload);
    const result = parser.parse(decoded);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("MISSING_RECIPIENT");
    }
  });

  test("4. Negative or non-numeric amount fails closed with INVALID_AMOUNT", async () => {
    const fixture = SYNTHETIC_QR_FIXTURES.INVALID_AMOUNT;
    const decoded = await decoder.decode(fixture.rawPayload);
    const result = parser.parse(decoded);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("INVALID_AMOUNT");
    }
  });

  test("5. Unsupported currency code fails closed with INVALID_CURRENCY", async () => {
    const fixture = SYNTHETIC_QR_FIXTURES.INVALID_CURRENCY;
    const decoded = await decoder.decode(fixture.rawPayload);
    const result = parser.parse(decoded);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("INVALID_CURRENCY");
    }
  });

  test("6. Dangerous javascript: scheme fails closed with UNSUPPORTED_SCHEME security rejection", async () => {
    const fixture = SYNTHETIC_QR_FIXTURES.JAVASCRIPT_SCHEME;
    const decoded = await decoder.decode(fixture.rawPayload);
    const result = parser.parse(decoded);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("UNSUPPORTED_SCHEME");
      expect(result.errorMessage).toContain("Security Rejection");
    }
  });

  test("7. Dangerous data: or file: schemes are rejected", async () => {
    const dataRes = parser.parse("data:text/html,<script>alert(1)</script>");
    expect(dataRes.success).toBe(false);
    if (!dataRes.success) {
      expect(dataRes.errorCode).toBe("UNSUPPORTED_SCHEME");
    }

    const fileRes = parser.parse("file:///etc/passwd");
    expect(fileRes.success).toBe(false);
    if (!fileRes.success) {
      expect(fileRes.errorCode).toBe("UNSUPPORTED_SCHEME");
    }
  });

  test("8. Unrecognised query parameters are captured in metadata without altering facts", async () => {
    const fixture = SYNTHETIC_QR_FIXTURES.UNEXPECTED_PARAMS;
    const decoded = await decoder.decode(fixture.rawPayload);
    const result = parser.parse(decoded);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.amount).toBe(2500);
      expect(result.data.metadata["custom_tracking_id"]).toBe("track_9988");
      expect(result.warnings?.length).toBeGreaterThan(0);
    }
  });

  test("9. Payment facts object is strictly IMMUTABLE / Frozen", async () => {
    const fixture = SYNTHETIC_QR_FIXTURES.NORMAL_PAYMENT;
    const decoded = await decoder.decode(fixture.rawPayload);
    const result = parser.parse(decoded);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(Object.isFrozen(result.data)).toBe(true);
      expect(() => {
        // @ts-ignore
        result.data.amount = 10;
      }).toThrow();
    }
  });

  test("10. Executes all 10 synthetic fixtures deterministically", async () => {
    for (const key of Object.keys(SYNTHETIC_QR_FIXTURES)) {
      const fixture = SYNTHETIC_QR_FIXTURES[key];
      const decoded = await decoder.decode(fixture.rawPayload);
      const result = parser.parse(decoded);

      if (fixture.expectedOutcome === "success") {
        expect(result.success).toBe(true);
        if (result.success) {
          if (fixture.expectedRecipient) expect(result.data.recipient).toBe(fixture.expectedRecipient);
          if (fixture.expectedAmount) expect(result.data.amount).toBe(fixture.expectedAmount);
        }
      } else {
        expect(result.success).toBe(false);
        if (!result.success && fixture.expectedErrorCode) {
          expect(result.errorCode).toBe(fixture.expectedErrorCode);
        }
      }
    }
  });
});
