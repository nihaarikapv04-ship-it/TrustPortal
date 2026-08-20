export interface RedactionResult {
    cleanText: string;
    redactionFlags: string[];
}
export declare class PIIRedactor {
    /**
     * Performs deterministic redaction on input string and returns clean text and redaction flags.
     */
    redact(text: string): RedactionResult;
}
export declare const piiRedactor: PIIRedactor;
//# sourceMappingURL=redactor.d.ts.map