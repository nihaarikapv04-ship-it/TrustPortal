export const DEFAULT_CONTEXT_BUDGET = {
    maxElementText: 150,
    maxAssociatedLabel: 200,
    maxHeading: 200,
    maxLandmark: 100,
    maxNearbyText: 300,
    maxNearbyNodes: 5,
    maxTotalCharacters: 800
};
export const SENSITIVE_URL_PATTERNS = [
    /\/login/i,
    /\/signin/i,
    /\/auth/i,
    /\/checkout/i,
    /\/payment/i,
    /\/pay/i,
    /\/otp/i,
    /\/2fa/i,
    /\/mfa/i,
    /\/tax/i,
    /\/health/i,
    /\/medical/i,
    /\/banking/i,
    /\/account\/settings/i,
    /\/identity/i,
    /\/ssn/i,
    /\/benefit/i,
    /\/legal/i
];
/**
 * Deterministically classifies page category based on URL path and page titles/headings.
 * Conservative fallback: "unknown" if uncertain.
 */
export function classifyPageCategory(urlPath, headingsText = "") {
    const combined = `${urlPath} ${headingsText}`.toLowerCase();
    if (/\/login|\/signin|\/auth|\/2fa|\/otp|\/password/i.test(combined))
        return "authentication";
    if (/\/checkout|\/payment|\/pay|\/cart|\/billing/i.test(combined))
        return "payment";
    if (/\/identity|\/aadhaar|\/pan|\/ssn|\/passport/i.test(combined))
        return "identity";
    if (/\/tax|\/income-tax|\/returns/i.test(combined))
        return "tax";
    if (/\/health|\/medical|\/hospital|\/patient/i.test(combined))
        return "health";
    if (/\/legal|\/court|\/affidavit/i.test(combined))
        return "legal";
    if (/\/benefit|\/scheme|\/pension|\/allowance/i.test(combined))
        return "benefits";
    if (/\/service|\/portal|\/apply/i.test(combined))
        return "service-information";
    if (/\/about|\/info|\/help|\/faq|\/guidelines/i.test(combined))
        return "public-information";
    return "unknown";
}
