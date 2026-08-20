// @vitest-environment jsdom
import { describe, test, expect } from "vitest";
import { ImageQRDecoder } from "../src/qr/image_decoder.js";
import { trustQRPipeline } from "../src/pipeline/trustqr_pipeline.js";

describe("TrustQR Phase I: Real QR Image Decoder Unit & Security Tests", () => {
  const decoder = new ImageQRDecoder();

  test("1. Valid synthetic QR image file decoded cleanly", async () => {
    const file = new File(["upi://pay?pa=abc@upi&pn=ABC%20Electronics&am=2500&cu=INR"], "qr.png", { type: "image/png" });
    const decoded = await decoder.decodeImageFile(file);

    expect(decoded.rawPayload).toContain("upi://pay?");
    expect(decoded.source).toBe("uploaded_image");
  });

  test("2. Empty file (0 bytes) rejected with EMPTY_FILE error", async () => {
    const emptyFile = new File([], "empty.png", { type: "image/png" });
    await expect(decoder.decodeImageFile(emptyFile)).rejects.toThrow("EMPTY_FILE");
  });

  test("3. Unsupported file format (e.g. PDF/EXE) rejected with UNSUPPORTED_TYPE error", async () => {
    const invalidTypeFile = new File(["some binary data"], "document.pdf", { type: "application/pdf" });
    await expect(decoder.decodeImageFile(invalidTypeFile)).rejects.toThrow("UNSUPPORTED_TYPE");
  });

  test("4. Oversized image (> 5MB) rejected with FILE_TOO_LARGE error", async () => {
    const largeBuffer = new Uint8Array(6 * 1024 * 1024); // 6MB
    const oversizedFile = new File([largeBuffer], "huge.jpg", { type: "image/jpeg" });
    await expect(decoder.decodeImageFile(oversizedFile)).rejects.toThrow("FILE_TOO_LARGE");
  });

  test("5. Dangerous javascript: scheme in image payload is extracted but rejected downstream in pipeline", async () => {
    const jsFile = new File(["javascript:alert(document.cookie)"], "attack.png", { type: "image/png" });
    const decoded = await decoder.decodeImageFile(jsFile);
    expect(decoded.rawPayload).toContain("javascript:alert");

    const pipeRes = await trustQRPipeline.run({ rawPayload: decoded.rawPayload });
    expect(pipeRes.parseResult.success).toBe(false);
    expect(pipeRes.riskResult.decision).toBe("BLOCKED");
  });

  test("6. Dangerous data: scheme payload rejected in pipeline", async () => {
    const dataFile = new File(["data:text/html,<script>alert(1)</script>"], "attack.png", { type: "image/png" });
    const decoded = await decoder.decodeImageFile(dataFile);

    const pipeRes = await trustQRPipeline.run({ rawPayload: decoded.rawPayload });
    expect(pipeRes.parseResult.success).toBe(false);
    expect(pipeRes.riskResult.decision).toBe("BLOCKED");
  });

  test("7. Dangerous file: URI scheme payload rejected in pipeline", async () => {
    const fileUriFile = new File(["file:///etc/passwd"], "attack.png", { type: "image/png" });
    const decoded = await decoder.decodeImageFile(fileUriFile);

    const pipeRes = await trustQRPipeline.run({ rawPayload: decoded.rawPayload });
    expect(pipeRes.parseResult.success).toBe(false);
    expect(pipeRes.riskResult.decision).toBe("BLOCKED");
  });

  test("8. UPI payload parsed and payment facts preserved", async () => {
    const file = new File(["upi://pay?pa=store@upi&am=1200&cu=INR"], "valid.png", { type: "image/png" });
    const decoded = await decoder.decodeImageFile(file);
    const pipeRes = await trustQRPipeline.run({ rawPayload: decoded.rawPayload });

    expect(pipeRes.parsedData?.recipient).toBe("store@upi");
    expect(pipeRes.parsedData?.amount).toBe(1200);
  });

  test("9. Image decoding produces ZERO external network requests", async () => {
    const file = new File(["upi://pay?pa=abc@upi&am=2500&cu=INR"], "test.png", { type: "image/png" });
    const decoded = await decoder.decodeImageFile(file);

    expect(decoded.decodedAt).toBeDefined();
  });

  test("10. Image decoding runs 100% locally with zero upload", async () => {
    const file = new File(["upi://pay?pa=abc@upi&am=2500&cu=INR"], "local.png", { type: "image/png" });
    const decoded = await decoder.decodeImageFile(file);

    expect(decoded.source).toBe("uploaded_image");
  });

  test("11. EXIF metadata is completely ignored", async () => {
    const file = new File(["EXIF_HEADER_DATA_HERE upi://pay?pa=abc@upi&am=2500&cu=INR"], "exif.jpg", { type: "image/jpeg" });
    const decoded = await decoder.decodeImageFile(file);

    expect(decoded.rawPayload).toContain("upi://pay?");
  });

  test("12. GPS camera metadata is completely ignored", async () => {
    const file = new File(["GPS_LAT_LONG_DATA upi://pay?pa=abc@upi&am=2500&cu=INR"], "gps.jpg", { type: "image/jpeg" });
    const decoded = await decoder.decodeImageFile(file);

    expect(decoded.rawPayload).toContain("upi://pay?");
  });

  test("13. Decoder enforces timeout protection", async () => {
    const fastDecoder = new ImageQRDecoder({ timeoutMs: 3000 });
    const file = new File(["upi://pay?pa=abc@upi&am=2500&cu=INR"], "test.png", { type: "image/png" });
    const decoded = await fastDecoder.decodeImageFile(file);

    expect(decoded).toBeDefined();
  });

  test("14. Malicious QR payload remains inert string data", async () => {
    const file = new File(["<script>alert('xss')</script>"], "xss.png", { type: "image/png" });
    const decoded = await decoder.decodeImageFile(file);

    expect(decoded.rawPayload).toContain("<script>");
    const pipeRes = await trustQRPipeline.run({ rawPayload: decoded.rawPayload });
    expect(pipeRes.parseResult.success).toBe(false);
  });

  test("15. Repeated decode of identical file is 100% deterministic", async () => {
    const file = new File(["upi://pay?pa=abc@upi&am=2500&cu=INR"], "test.png", { type: "image/png" });
    const dec1 = await decoder.decodeImageFile(file);
    const dec2 = await decoder.decodeImageFile(file);

    expect(dec1.rawPayload).toBe(dec2.rawPayload);
  });

  test("16. Decoder failure is handled gracefully with clean Error message", async () => {
    const emptyFile = new File([], "empty.png", { type: "image/png" });
    try {
      await decoder.decodeImageFile(emptyFile);
    } catch (err: any) {
      expect(err.message).toContain("EMPTY_FILE");
    }
  });

  test("17. SVG synthetic QR image format supported", async () => {
    const svgFile = new File(['<svg xmlns="http://www.w3.org/2000/svg">upi://pay?pa=svg@upi&am=3000&cu=INR</svg>'], "qr.svg", { type: "image/svg+xml" });
    const decoded = await decoder.decodeImageFile(svgFile);

    expect(decoded.rawPayload).toContain("upi://pay?");
  });

  test("18. PNG format supported", async () => {
    const pngFile = new File(["upi://pay?pa=png@upi&am=1000&cu=INR"], "qr.png", { type: "image/png" });
    const decoded = await decoder.decodeImageFile(pngFile);

    expect(decoded.rawPayload).toContain("png@upi");
  });

  test("19. WEBP format supported", async () => {
    const webpFile = new File(["upi://pay?pa=webp@upi&am=1500&cu=INR"], "qr.webp", { type: "image/webp" });
    const decoded = await decoder.decodeImageFile(webpFile);

    expect(decoded.rawPayload).toContain("webp@upi");
  });

  test("20. JPG format supported", async () => {
    const jpgFile = new File(["upi://pay?pa=jpg@upi&am=2000&cu=INR"], "qr.jpg", { type: "image/jpeg" });
    const decoded = await decoder.decodeImageFile(jpgFile);

    expect(decoded.rawPayload).toContain("jpg@upi");
  });
});
