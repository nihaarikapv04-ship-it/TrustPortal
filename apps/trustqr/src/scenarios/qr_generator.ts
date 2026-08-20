/**
 * Local-only Developer Synthetic QR Data Generator.
 * Creates synthetic SVG data URLs for test payloads.
 * Contains ZERO merchant data, zero network calls, and zero external dependencies.
 */
export class LocalQRGenerator {
  public generateSyntheticQRDataURL(rawPayload: string): string {
    const encodedText = encodeURIComponent(rawPayload);
    // Return a clean local SVG data URL representation of synthetic QR code
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#ffffff"/>
      <rect x="20" y="20" width="160" height="160" fill="none" stroke="#0f172a" stroke-width="6"/>
      <rect x="35" y="35" width="40" height="40" fill="#0f172a"/>
      <rect x="125" y="35" width="40" height="40" fill="#0f172a"/>
      <rect x="35" y="125" width="40" height="40" fill="#0f172a"/>
      <text x="100" y="105" font-family="sans-serif" font-size="10" fill="#2563eb" text-anchor="middle">TRUSTQR DEMO</text>
      <!-- ${encodedText} -->
    </svg>`;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }
}

export const localQRGenerator = new LocalQRGenerator();
