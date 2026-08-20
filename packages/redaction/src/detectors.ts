export const PATTERNS = {
  email: /\b[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+\b/g,
  phone: /(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
  creditCard: /\b(?:\d[ -]*?){13,16}\b/g,
  ssnAadhaarPan: /\b(?:\d{3}-\d{2}-\d{4}|\d{4}\s?\d{4}\s?\d{4}|[A-Z]{5}\d{4}[A-Z]{1})\b/g,
  otp: /\b(?:otp|one-time-code|passcode)\s*[:=]?\s*\d{4,8}\b/gi,
  token: /\b(?:bearer\s+[a-zA-Z0-9._~+/-]+=*|ey[Jj][a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+|api_key=[a-zA-Z0-9_-]+)\b/gi,
  queryStringSecret: /[?&](?:token|secret|key|auth|password|session|api_key)=[^&\s]+/gi
};

export interface SensitiveMatch {
  type: "email" | "phone" | "creditCard" | "ssnAadhaarPan" | "otp" | "token" | "queryStringSecret";
  matchedText: string;
}

export function detectSensitivePatterns(text: string): SensitiveMatch[] {
  const matches: SensitiveMatch[] = [];
  if (!text) return matches;

  if (PATTERNS.email.test(text)) {
    for (const m of text.match(PATTERNS.email) || []) {
      matches.push({ type: "email", matchedText: m });
    }
  }

  if (PATTERNS.phone.test(text)) {
    for (const m of text.match(PATTERNS.phone) || []) {
      matches.push({ type: "phone", matchedText: m });
    }
  }

  if (PATTERNS.creditCard.test(text)) {
    for (const m of text.match(PATTERNS.creditCard) || []) {
      matches.push({ type: "creditCard", matchedText: m });
    }
  }

  if (PATTERNS.ssnAadhaarPan.test(text)) {
    for (const m of text.match(PATTERNS.ssnAadhaarPan) || []) {
      matches.push({ type: "ssnAadhaarPan", matchedText: m });
    }
  }

  if (PATTERNS.token.test(text)) {
    for (const m of text.match(PATTERNS.token) || []) {
      matches.push({ type: "token", matchedText: m });
    }
  }

  if (PATTERNS.queryStringSecret.test(text)) {
    for (const m of text.match(PATTERNS.queryStringSecret) || []) {
      matches.push({ type: "queryStringSecret", matchedText: m });
    }
  }

  return matches;
}
