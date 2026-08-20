export declare const PATTERNS: {
    email: RegExp;
    phone: RegExp;
    creditCard: RegExp;
    ssnAadhaarPan: RegExp;
    otp: RegExp;
    token: RegExp;
    queryStringSecret: RegExp;
};
export interface SensitiveMatch {
    type: "email" | "phone" | "creditCard" | "ssnAadhaarPan" | "otp" | "token" | "queryStringSecret";
    matchedText: string;
}
export declare function detectSensitivePatterns(text: string): SensitiveMatch[];
//# sourceMappingURL=detectors.d.ts.map