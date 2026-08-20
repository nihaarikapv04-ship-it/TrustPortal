// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from "vitest";
import { TrustQRApp } from "../src/ui/app.js";

describe("TrustQR Phase I: Image Flow E2E Integration Tests", () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    container.id = "app";
    document.body.appendChild(container);
  });

  test("1. Upload Mode Tab switches UI and displays file drop zone", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    const tabUpload = container.querySelector("#tab-upload") as HTMLButtonElement;
    tabUpload.click();

    expect(container.innerHTML).toContain("Drop QR Image Here or Click to Select");
    expect(container.innerHTML).toContain("Source: <strong>Uploaded QR Image</strong>");
  });

  test("2. Camera Mode Tab displays camera permission scan button", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    const tabCamera = container.querySelector("#tab-camera") as HTMLButtonElement;
    tabCamera.click();

    expect(container.innerHTML).toContain("Scan with Camera");
    expect(container.innerHTML).toContain("Source: <strong>Camera Scan</strong>");
  });

  test("3. Research View toggle displays stage outcomes matrix", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    const btnResearch = container.querySelector("#btn-toggle-research") as HTMLButtonElement;
    btnResearch.click();
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(container.innerHTML).toContain("RESEARCH VIEW — Pipeline Outcomes");
    expect(container.innerHTML).toContain("1. QR Decode");
    expect(container.innerHTML).toContain("4. Privacy Filter");
    expect(container.innerHTML).toContain("6. Risk Gate");
  });

  test("4. Security Boundaries Proof panel is present in UI DOM", async () => {
    const app = new TrustQRApp(container);
    await app.render();

    expect(container.innerHTML).toContain("SECURITY BOUNDARIES PROOF");
    expect(container.innerHTML).toContain("✓ No payment execution");
    expect(container.innerHTML).toContain("✓ Zero QR image upload");
  });
});
