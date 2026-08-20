import { RawDecodedQR, RawDecodedQRSchema } from "./payment_schema.js";

/**
 * QRDecoder interface designed for compatibility with future camera/image decoders.
 */
export interface QRDecoder {
  decode(input: string | { rawPayload: string }): Promise<RawDecodedQR>;
}

/**
 * Local synthetic QR decoder for prototype testing and fixture execution.
 */
export class SyntheticQRDecoder implements QRDecoder {
  public async decode(input: string | { rawPayload: string }): Promise<RawDecodedQR> {
    const rawPayload = typeof input === "string" ? input : input.rawPayload;

    if (!rawPayload || typeof rawPayload !== "string") {
      throw new Error("Invalid QR input: Raw payload must be a non-empty string");
    }

    const decoded = {
      rawPayload: rawPayload.trim(),
      format: "QR_CODE",
      decodedAt: new Date().toISOString()
    };

    return Object.freeze(RawDecodedQRSchema.parse(decoded));
  }
}

export const syntheticQRDecoder = new SyntheticQRDecoder();
