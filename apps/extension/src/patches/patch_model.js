export const ALLOWLISTED_ATTRIBUTES = new Set([
    "alt",
    "aria-label",
    "aria-labelledby",
    "aria-describedby"
]);
export const STRICTLY_FORBIDDEN_ATTRIBUTES = new Set([
    "href",
    "src",
    "action",
    "method",
    "value",
    "onclick",
    "onload",
    "onerror",
    "style",
    "class",
    "id",
    "role",
    "tabindex",
    "name",
    "type",
    "innerhtml",
    "outerhtml"
]);
/**
 * Validates compatibility between issue type and permitted attribute.
 */
export function validateIssueAttributeCompatibility(issueType, attribute) {
    switch (issueType) {
        case "img-alt":
            return attribute === "alt";
        case "button-name":
            return attribute === "aria-label" || attribute === "aria-labelledby";
        case "link-name":
            return attribute === "aria-label" || attribute === "aria-labelledby";
        case "form-label":
            return (attribute === "aria-label" ||
                attribute === "aria-labelledby" ||
                attribute === "aria-describedby");
        default:
            return attribute === "aria-label";
    }
}
