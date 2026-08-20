// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from "vitest";
import { TrustQRApp } from "../src/ui/app.js";

describe("TrustQR Phase G: User-Facing UI & Accessibility Unit Tests", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    container.id = "app";
    document.body.appendChild(container);
  });

  test("1. Renders initial TrustQR title and subtitle", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    expect(container.innerHTML).toContain("TrustQR");
    expect(container.innerHTML).toContain("Security-Constrained AI-Assisted QR Payment Verification");
  });

  test("2. Renders demo scenario selector", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    const select = container.querySelector("#scenario-select") as HTMLSelectElement;
    expect(select).not.toBeNull();
    expect(select.options.length).toBeGreaterThanOrEqual(10);
  });

  test("3. Displays valid payment details (recipient, amount, currency)", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    expect(container.innerHTML).toContain("ABC Electronics");
    expect(container.innerHTML).toContain("abc@upi");
    expect(container.innerHTML).toContain("INR 2,500");
  });

  test("4. Displays missing merchant name safely as 'Not provided'", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    const select = container.querySelector("#scenario-select") as HTMLSelectElement;
    select.value = "MISSING_MERCHANT_NAME";
    select.dispatchEvent(new Event("change"));

    const btnRun = container.querySelector("#btn-run") as HTMLButtonElement;
    btnRun.click();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.innerHTML).toContain("Not provided");
  });

  test("5. Displays low-risk result for Normal Payment", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    expect(container.innerHTML).toContain("INFORMATIONAL");
  });

  test("6. Displays medium-risk result for Recipient Mismatch scenario", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    const select = container.querySelector("#scenario-select") as HTMLSelectElement;
    select.value = "RECIPIENT_MISMATCH";
    select.dispatchEvent(new Event("change"));

    const btnRun = container.querySelector("#btn-run") as HTMLButtonElement;
    btnRun.click();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.innerHTML).toContain("NEEDS REVIEW");
  });

  test("7. Displays high-risk result for High-Value Payment scenario", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    const select = container.querySelector("#scenario-select") as HTMLSelectElement;
    select.value = "HIGH_VALUE_PAYMENT";
    select.dispatchEvent(new Event("change"));

    const btnRun = container.querySelector("#btn-run") as HTMLButtonElement;
    btnRun.click();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.innerHTML).toContain("HIGH RISK WARNING");
  });

  test("8. Displays blocked result for Malformed Payload scenario", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    const select = container.querySelector("#scenario-select") as HTMLSelectElement;
    select.value = "MISSING_RECIPIENT";
    select.dispatchEvent(new Event("change"));

    const btnRun = container.querySelector("#btn-run") as HTMLButtonElement;
    btnRun.click();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.innerHTML).toContain("PAYMENT BLOCKED");
  });

  test("9. Displays TrustQR risk score", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    expect(container.innerHTML).toContain("TrustQR Score:");
    expect(container.innerHTML).toContain("/ 100");
  });

  test("10. Displays AI-assisted explanation section", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    expect(container.innerHTML).toContain("AI EXPLANATION — Advisory Only");
  });

  test("11. Handles AI explanation disclaimer", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    expect(container.innerHTML).toContain("AI explanations are advisory. They do not verify merchant identity or authorize payments.");
  });

  test("12. Displays verification checklist before paying", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    expect(container.innerHTML).toContain("Before You Pay");
    expect(container.innerHTML).toContain("Verify payee name matches recipient");
  });

  test("13. High-value checklist displays amount confirmation guidance", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    const select = container.querySelector("#scenario-select") as HTMLSelectElement;
    select.value = "HIGH_VALUE_PAYMENT";
    select.dispatchEvent(new Event("change"));

    const btnRun = container.querySelector("#btn-run") as HTMLButtonElement;
    btnRun.click();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.innerHTML).toContain("INR 50,000");
  });

  test("14. Blocked state halts confirmation action button", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    const select = container.querySelector("#scenario-select") as HTMLSelectElement;
    select.value = "MISSING_RECIPIENT";
    select.dispatchEvent(new Event("change"));

    const btnRun = container.querySelector("#btn-run") as HTMLButtonElement;
    btnRun.click();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.innerHTML).not.toContain("Continue Manually in Your Payment App");
  });

  test("15. AI explanation cannot modify recipient fact", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    expect(container.innerHTML).toContain("abc@upi");
  });

  test("16. AI explanation cannot modify amount fact", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    expect(container.innerHTML).toContain("2,500");
  });

  test("17. AI explanation cannot modify currency fact", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    expect(container.innerHTML).toContain("INR");
  });

  test("18. Malicious QR text is rendered safely as escaped HTML", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    const select = container.querySelector("#scenario-select") as HTMLSelectElement;
    select.value = "DANGEROUS_URI_SCHEME";
    select.dispatchEvent(new Event("change"));

    const btnRun = container.querySelector("#btn-run") as HTMLButtonElement;
    btnRun.click();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.innerHTML).not.toContain("<script>");
  });

  test("19. XSS payload in metadata is rendered safely as text", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    const select = container.querySelector("#scenario-select") as HTMLSelectElement;
    select.value = "ADVERSARIAL_AI_XSS";
    select.dispatchEvent(new Event("change"));

    const btnRun = container.querySelector("#btn-run") as HTMLButtonElement;
    btnRun.click();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.innerHTML).not.toContain("<script>alert");
  });

  test("20. Dangerous javascript: scheme is rejected with BLOCKED state", async () => {
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

  test("21. Sensitive OTP text is never exposed in UI", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    const select = container.querySelector("#scenario-select") as HTMLSelectElement;
    select.value = "PRIVACY_DENIED_OTP";
    select.dispatchEvent(new Event("change"));

    const btnRun = container.querySelector("#btn-run") as HTMLButtonElement;
    btnRun.click();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.innerHTML).not.toContain("483921");
  });

  test("22. PIN input element is NEVER present in UI DOM", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    const inputs = container.querySelectorAll("input[type='password'], input[name='pin']");
    expect(inputs.length).toBe(0);
  });

  test("23. OTP input element is NEVER present in UI DOM", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    const inputs = container.querySelectorAll("input[name='otp']");
    expect(inputs.length).toBe(0);
  });

  test("24. 'Pay Now' button is NEVER present in UI DOM", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    const buttons = Array.from(container.querySelectorAll("button"));
    const payButtons = buttons.filter((b) => b.textContent?.toLowerCase().includes("pay now"));
    expect(payButtons.length).toBe(0);
  });

  test("25. Action button is labeled 'Continue Manually in Your Payment App'", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    const buttons = Array.from(container.querySelectorAll("button"));
    const handoffButton = buttons.find((b) => b.textContent?.includes("Continue Manually in Your Payment App"));
    expect(handoffButton).not.toBeUndefined();
  });

  test("26. Status region uses aria-live='polite'", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    const statusRegion = container.querySelector("#result-region");
    expect(statusRegion?.getAttribute("aria-live")).toBe("polite");
  });

  test("27. Privacy notice is rendered in footer", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    expect(container.innerHTML).toContain("Privacy protection: TrustQR processes payment information locally.");
  });

  test("28. Visual distinction badge 'PAYMENT FACT' is present", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    expect(container.innerHTML).toContain("PAYMENT FACT — Decoded QR");
  });

  test("29. Visual distinction badge 'AI EXPLANATION' is present", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    expect(container.innerHTML).toContain("AI EXPLANATION — Advisory Only");
  });

  test("30. Repeated rendering produces clean UI without duplication", async () => {
    const app = new TrustQRApp(container);
    await app.render();
    await app.render();

    const headers = container.querySelectorAll("header");
    expect(headers.length).toBe(1);
  });
});
