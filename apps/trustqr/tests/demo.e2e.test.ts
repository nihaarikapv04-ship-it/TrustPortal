// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from "vitest";
import { TrustQRApp } from "../src/ui/app.js";

describe("TrustQR Phase H: E2E Demo Scenario Flow Tests", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    container.id = "app";
    document.body.appendChild(container);
  });

  test("1. Golden Path (NORMAL_PAYMENT): Renders Facts, Risk Score, AI Explanation, & Checklist", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    expect(container.innerHTML).toContain("ABC Electronics");
    expect(container.innerHTML).toContain("abc@upi");
    expect(container.innerHTML).toContain("INR 2,500");
    expect(container.innerHTML).toContain("INFORMATIONAL");
    expect(container.innerHTML).toContain("AI EXPLANATION — Advisory Only");
    expect(container.innerHTML).toContain("Before You Pay");
  });

  test("2. Privacy Golden Negative Path (PRIVACY_DENIED_PIN): BLOCKED, AI Not Executed, PIN Absent", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    const select = container.querySelector("#scenario-select") as HTMLSelectElement;
    select.value = "PRIVACY_DENIED_PIN";
    select.dispatchEvent(new Event("change"));

    const btnRun = container.querySelector("#btn-run") as HTMLButtonElement;
    btnRun.click();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.innerHTML).toContain("PAYMENT BLOCKED");
    expect(container.innerHTML).toContain("AI Provider call count: 0");
    expect(container.innerHTML).not.toContain("123456");
  });

  test("3. Adversarial AI Path (ADVERSARIAL_AI_XSS): Output Validator rejects XSS, no script executes", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    const select = container.querySelector("#scenario-select") as HTMLSelectElement;
    select.value = "ADVERSARIAL_AI_XSS";
    select.dispatchEvent(new Event("change"));

    const btnRun = container.querySelector("#btn-run") as HTMLButtonElement;
    btnRun.click();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.innerHTML).toContain("AI explanation unavailable.");
    expect(container.innerHTML).not.toContain("<script>alert");
  });

  test("4. Dangerous QR Path (DANGEROUS_URI_SCHEME): Fails closed, zero execution", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    const select = container.querySelector("#scenario-select") as HTMLSelectElement;
    select.value = "DANGEROUS_URI_SCHEME";
    select.dispatchEvent(new Event("change"));

    const btnRun = container.querySelector("#btn-run") as HTMLButtonElement;
    btnRun.click();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.innerHTML).toContain("PAYMENT BLOCKED");
  });

  test("5. High-Value Path (HIGH_VALUE_PAYMENT): Shows HIGH RISK WARNING banner", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    const select = container.querySelector("#scenario-select") as HTMLSelectElement;
    select.value = "HIGH_VALUE_PAYMENT";
    select.dispatchEvent(new Event("change"));

    const btnRun = container.querySelector("#btn-run") as HTMLButtonElement;
    btnRun.click();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.innerHTML).toContain("HIGH RISK WARNING");
    expect(container.innerHTML).toContain("INR 50,000");
  });

  test("6. Recipient Mismatch Path (RECIPIENT_MISMATCH): Shows NEEDS REVIEW badge", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    const select = container.querySelector("#scenario-select") as HTMLSelectElement;
    select.value = "RECIPIENT_MISMATCH";
    select.dispatchEvent(new Event("change"));

    const btnRun = container.querySelector("#btn-run") as HTMLButtonElement;
    btnRun.click();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.innerHTML).toContain("NEEDS REVIEW");
    expect(container.innerHTML).toContain("random123@upi");
  });
});
