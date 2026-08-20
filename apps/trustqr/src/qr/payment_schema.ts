import { z } from "zod";

export const RawDecodedQRSchema = z.object({
  rawPayload: z.string().min(1),
  format: z.string().default("QR_CODE"),
  decodedAt: z.string().default(() => new Date().toISOString()),
  source: z.string().optional()
});

export type RawDecodedQR = z.infer<typeof RawDecodedQRSchema>;

export const ParsedPaymentDataSchema = z.object({
  scheme: z.literal("upi"),
  recipient: z.string().min(1), // Payee UPI ID (e.g. merchant@upi)
  merchantName: z.string().optional(), // Display Name
  amount: z.number().positive(),
  currency: z.string().length(3), // ISO 4217 Currency (e.g. INR)
  transactionRef: z.string().optional(), // Reference/Txn ID
  transactionNote: z.string().optional(), // Transaction Note (tn)
  metadata: z.record(z.string()).default({})
});

export type ParsedPaymentData = z.infer<typeof ParsedPaymentDataSchema>;

export interface ParseSuccessResult {
  success: true;
  data: ParsedPaymentData;
  rawPayload?: string;
  warnings?: readonly string[];
}

export interface ParseFailureResult {
  success: false;
  errorMessage: string;
  errorCode?: string;
  data?: null;
  rawPayload?: string;
}

export type ParseResult = ParseSuccessResult | ParseFailureResult;
