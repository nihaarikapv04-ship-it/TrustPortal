"""
Privacy + Injection Firewall (Context Firewall).
Enforces deny-by-default on sensitive workflows, PII redaction, and non-compensable injection detection.
"""

from typing import Dict, Any, Optional, Tuple, List
from dataclasses import dataclass, field
import re
import logging

logger = logging.getLogger("trustportal.firewall")

SENSITIVE_URL_PATTERNS = [
    r"/login", r"/signin", r"/auth", r"/checkout", r"/payment", r"/pay",
    r"/otp", r"/2fa", r"/mfa", r"/register", r"/signup", r"/tax",
    r"/health", r"/medical", r"/banking", r"/account/settings", r"/identity", r"/ssn"
]

SENSITIVE_KEYWORDS = [
    "password", "passcode", "credit card", "cvv", "ssn", "social security",
    "aadhaar", "pan card", "one time password", "otp", "bank account", "pin code",
    "access token", "bearer token", "secret key"
]

# Patterns for prompt injection detection (naive, GCG-style, jailbreaks, hidden attacks)
INJECTION_PATTERNS = [
    r"ignore\s+(all\s+)?(previous|above|prior)\s+(instructions|prompts|rules)",
    r"system\s+prompt\s+override",
    r"you\s+are\s+now\s+a",
    r"DAN\s+mode",
    r"developer\s+mode\s+enabled",
    r"override\s+policy",
    r"IMPORTANT\s+INSTRUCTION\s*:",
    r"new\s+rule\s*:",
    r"eval\(",
    r"<script\b",
    r"javascript\s*:",
    r"\[SYSTEM_NOTE\]",
    r"```system",
    r"do\s+not\s+follow\s+safety",
    r"always\s+return\s+confidence\s*=\s*1\.0",
    r"output\s+only\s+the\s+following"
]


@dataclass(frozen=True)
class SafeContext:
    defect_id: str
    issue_type: str
    element_fingerprint: str
    tag: str
    role: Optional[str]
    clean_surrounding_context: Dict[str, str]
    pii_redacted_count: int
    audit_logs: List[str]


@dataclass(frozen=True)
class FirewallAbstainResult:
    defect_id: str
    reason: str  # "SENSITIVE_WORKFLOW" | "PROMPT_INJECTION_DETECTED" | "PII_OVERFLOW"
    details: str
    audit_logs: List[str]


class ContextFirewall:
    """
    Sanitizes surrounding DOM context and evaluates injection / sensitive workflow risks.
    Non-compensable: If an injection or sensitive workflow is flagged, abstains immediately.
    """

    def __init__(self, sensitive_patterns: Optional[List[str]] = None):
        self.sensitive_url_regex = [re.compile(p, re.IGNORECASE) for p in (sensitive_patterns or SENSITIVE_URL_PATTERNS)]
        self.injection_regex = [re.compile(p, re.IGNORECASE) for p in INJECTION_PATTERNS]

    def process(self, defect_id: str, issue_type: str, element_fingerprint: str, tag: str, role: Optional[str], url_path: str, context: Dict[str, Any]) -> Tuple[Optional[SafeContext], Optional[FirewallAbstainResult]]:
        audit_logs: List[str] = []

        # 1. Check Sensitive Workflow (URL path / keywords)
        if self._is_sensitive_url(url_path):
            msg = f"Denied: Page URL path '{url_path}' matched sensitive workflow pattern."
            audit_logs.append(msg)
            logger.warning(msg)
            return None, FirewallAbstainResult(defect_id, "SENSITIVE_WORKFLOW", msg, audit_logs)

        # Check sensitive keywords in raw surrounding context
        context_str = " ".join([str(v) for v in context.values() if isinstance(v, str)])
        for kw in SENSITIVE_KEYWORDS:
            if kw.lower() in context_str.lower():
                msg = f"Denied: Context contained sensitive keyword '{kw}'."
                audit_logs.append(msg)
                logger.warning(msg)
                return None, FirewallAbstainResult(defect_id, "SENSITIVE_WORKFLOW", msg, audit_logs)

        # 2. Injection Detection Gate (Non-compensable!)
        # Tradeoff explicitly noted: We inspect visible AND hidden_text to catch display:none injection payloads!
        for key, val in context.items():
            if not isinstance(val, str):
                continue
            for pattern in self.injection_regex:
                if pattern.search(val):
                    msg = f"Security Firewall Alert: Prompt injection pattern '{pattern.pattern}' detected in context field '{key}'!"
                    audit_logs.append(msg)
                    logger.error(msg)
                    return None, FirewallAbstainResult(defect_id, "PROMPT_INJECTION_DETECTED", msg, audit_logs)

        # 3. PII Redaction
        clean_context, redacted_count = self._redact_pii(context, audit_logs)

        safe_ctx = SafeContext(
            defect_id=defect_id,
            issue_type=issue_type,
            element_fingerprint=element_fingerprint,
            tag=tag,
            role=role,
            clean_surrounding_context=clean_context,
            pii_redacted_count=redacted_count,
            audit_logs=audit_logs
        )
        return safe_ctx, None

    def _is_sensitive_url(self, url_path: str) -> bool:
        if not url_path:
            return False
        return any(regex.search(url_path) for regex in self.sensitive_url_regex)

    def _redact_pii(self, context: Dict[str, Any], audit_logs: List[str]) -> Tuple[Dict[str, str], int]:
        clean_ctx = {}
        total_redactions = 0

        # Regex patterns for PII
        email_pattern = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")
        phone_pattern = re.compile(r"\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b")
        card_pattern = re.compile(r"\b(?:\d[ -]*?){13,16}\b")
        ssn_aadhaar_pan = re.compile(r"\b(?:\d{3}-\d{2}-\d{4}|\d{4}\s?\d{4}\s?\d{4}|[A-Z]{5}\d{4}[A-Z]{1})\b")
        token_pattern = re.compile(r"\b(?:bearer\s+[a-zA-Z0-9._~+/-]+=*|ey[Jj][a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+)\b", re.IGNORECASE)

        for k, v in context.items():
            if not isinstance(v, str):
                clean_ctx[k] = str(v)
                continue

            text = v
            text, c1 = email_pattern.subn("[REDACTED_EMAIL]", text)
            text, c2 = phone_pattern.subn("[REDACTED_PHONE]", text)
            text, c3 = card_pattern.subn("[REDACTED_CARD]", text)
            text, c4 = ssn_aadhaar_pan.subn("[REDACTED_ID]", text)
            text, c5 = token_pattern.subn("[REDACTED_TOKEN]", text)

            field_redactions = c1 + c2 + c3 + c4 + c5
            if field_redactions > 0:
                audit_logs.append(f"PII Redacted in field '{k}': {field_redactions} instance(s).")
                total_redactions += field_redactions

            # Enforce max field length limit (e.g. 500 chars)
            if len(text) > 500:
                text = text[:500] + "...[TRUNCATED]"

            clean_ctx[k] = text

        return clean_ctx, total_redactions
