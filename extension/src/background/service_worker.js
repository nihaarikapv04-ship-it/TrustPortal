/**
 * TrustPortal TSIF Background Service Worker (MV3).
 * Stateless design using chrome.storage.local for persistence across service worker restarts.
 * Handles API communication with Backend, policy updates, rate limiting, and feedback logging.
 */
const BACKEND_API_URL = "http://localhost:3000/v1";
chrome.runtime.onInstalled.addListener(() => {
    console.log("🛡️ TrustPortal TSIF Service Worker Installed.");
    chrome.storage.local.set({
        policy: {
            targetAlpha: 0.05,
            globalLambdaStar: 0.85,
            roleLambdaStars: {
                "img-alt": 0.85,
                "button-name": 0.90,
                "link-name": 0.82,
                "form-label": 0.88
            }
        }
    });
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "PROCESS_DEFECT") {
        handleProcessDefect(message.payload, message.urlPath)
            .then((res) => sendResponse({ success: true, patch: res }))
            .catch((err) => sendResponse({ success: false, error: err.message }));
        return true; // Keep async response channel open
    }
    if (message.type === "SUBMIT_FEEDBACK") {
        handleFeedback(message.patchId, message.feedback)
            .then(() => sendResponse({ success: true }))
            .catch((err) => sendResponse({ success: false, error: err.message }));
        return true;
    }
});
async function handleProcessDefect(payload, urlPath) {
    // Check sensitive URL path client-side deny-list
    if (isSensitiveUrl(urlPath)) {
        return {
            patchId: "p_abstain_" + Date.now(),
            issueType: payload.issueType || "img-alt",
            targetFingerprint: payload.id || "elem",
            targetSelector: payload.selector || "elem",
            attribute: "aria-label",
            previousValue: null,
            proposedValue: "",
            evidence: [],
            trustScore: 0.0,
            crcThresholdUsed: 0.85,
            decision: "reject",
            modelVersion: "N/A",
            timestamp: new Date().toISOString(),
            status: "rejected",
            reason: "SENSITIVE_WORKFLOW_DENIED"
        };
    }
    try {
        // Attempt backend POST /v1/proposals call
        const res = await fetch(`${BACKEND_API_URL}/proposals`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ payload, urlPath })
        });
        if (res.ok) {
            const data = await res.json();
            return data.patch;
        }
    }
    catch (e) {
        console.warn("Backend API unavailable. Falling back to local client-side trust policy decision.");
    }
    // Client-side Fallback Policy logic if backend is offline
    const storage = await chrome.storage.local.get("policy");
    const policy = storage.policy || { globalLambdaStar: 0.85 };
    const issueType = detectIssueType(payload.tag, payload.attributes);
    const lmbda = policy.roleLambdaStars?.[issueType] || policy.globalLambdaStar || 0.85;
    const mockLabel = generateFallbackLabel(issueType, payload.surrounding_context);
    const confidence = mockLabel ? 0.88 : 0.50;
    const decision = confidence >= lmbda ? "auto" : confidence >= lmbda - 0.15 ? "confirm" : "reject";
    return {
        patchId: "p_local_" + Math.random().toString(36).substring(2, 9),
        issueType: issueType,
        targetFingerprint: payload.id || "fp_elem",
        targetSelector: payload.selector || payload.tag,
        attribute: getAttributeForIssue(issueType),
        previousValue: null,
        proposedValue: mockLabel,
        evidence: [
            `Heading: ${payload.surrounding_context?.nearest_heading || 'None'}`,
            `Parent: ${payload.surrounding_context?.parent_text?.slice(0, 30) || 'None'}`
        ],
        trustScore: confidence,
        crcThresholdUsed: lmbda,
        decision: decision,
        modelVersion: "local-client-fallback-v1",
        timestamp: new Date().toISOString(),
        status: "applied"
    };
}
async function handleFeedback(patchId, feedback) {
    try {
        await fetch(`${BACKEND_API_URL}/feedback`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ patchId, feedback, timestamp: new Date().toISOString() })
        });
    }
    catch (e) {
        console.warn("Failed to log feedback to backend:", e);
    }
}
function isSensitiveUrl(urlPath) {
    const sensitiveRegex = /\/(login|signin|checkout|payment|auth|otp|2fa|tax|health|bank)/i;
    return sensitiveRegex.test(urlPath);
}
function detectIssueType(tag, attrs) {
    if (tag === "img")
        return "img-alt";
    if (tag === "button" || attrs?.role === "button")
        return "button-name";
    if (tag === "a" || attrs?.role === "link")
        return "link-name";
    if (tag === "input" || tag === "select" || tag === "textarea")
        return "form-label";
    return "custom-control";
}
function getAttributeForIssue(issueType) {
    if (issueType === "img-alt")
        return "alt";
    return "aria-label";
}
function generateFallbackLabel(issueType, ctx) {
    const heading = ctx?.nearest_heading || "";
    const parent = ctx?.parent_text || "";
    if (issueType === "img-alt") {
        if (parent.toLowerCase().includes("logo"))
            return "Company Logo";
        if (heading)
            return `Illustration for ${heading}`;
        return "Descriptive Image";
    }
    if (issueType === "button-name") {
        if (parent.toLowerCase().includes("search"))
            return "Search";
        return "Submit";
    }
    if (issueType === "form-label") {
        if (parent.toLowerCase().includes("email"))
            return "Email Address";
        return "Input Field";
    }
    return "Interactive Element";
}
export {};
