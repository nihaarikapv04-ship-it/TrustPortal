/**
 * WAI-ARIA 1.2 Accessible Name Computer (DOM & Dict Representation Support).
 */
export class AccessibleNameComputer {
    domMap = new Map();
    constructor(domMap) {
        if (domMap) {
            for (const [id, elem] of Object.entries(domMap)) {
                this.domMap.set(id, elem);
            }
        }
    }
    /**
     * Computes accessible name from a native DOM Element.
     */
    computeForElement(element) {
        const tag = element.tagName.toLowerCase();
        const role = element.getAttribute("role");
        const attrs = {};
        for (let i = 0; i < element.attributes.length; i++) {
            const a = element.attributes[i];
            attrs[a.name] = a.value;
        }
        // Collect child text / img alt
        const children = Array.from(element.children).map((child) => ({
            tag: child.tagName.toLowerCase(),
            attributes: Array.from(child.attributes).reduce((acc, a) => ({ ...acc, [a.name]: a.value }), {}),
            textContent: child.textContent
        }));
        // Collect associated labels if input
        let labels = [];
        if ("labels" in element && element.labels) {
            labels = Array.from(element.labels).map((l) => l.textContent || "");
        }
        const repr = {
            tag,
            id: element.id || null,
            role: role || null,
            attributes: attrs,
            textContent: element.textContent,
            children,
            labels
        };
        return this.computeName(repr);
    }
    /**
     * Computes accessible name from an ElementRepresentation dictionary.
     */
    computeName(element) {
        const attrs = element.attributes || {};
        const tag = (element.tag || "").toLowerCase();
        const role = element.role ? element.role.toLowerCase() : null;
        // 1. Check aria-labelledby
        if (attrs["aria-labelledby"] && attrs["aria-labelledby"].trim()) {
            const refIds = attrs["aria-labelledby"].split(/\s+/);
            const parts = [];
            for (const refId of refIds) {
                if (this.domMap.has(refId)) {
                    const refElem = this.domMap.get(refId);
                    const part = refElem.textContent || this.computeName(refElem);
                    if (part && part.trim())
                        parts.push(part.trim());
                }
                else if (refId === element.id) {
                    if (element.textContent && element.textContent.trim()) {
                        parts.push(element.textContent.trim());
                    }
                }
            }
            if (parts.length > 0)
                return parts.join(" ");
        }
        // 2. Check aria-label
        if (attrs["aria-label"] && attrs["aria-label"].trim()) {
            return attrs["aria-label"].trim();
        }
        // 3. Host language native rules
        if (tag === "img" || role === "img") {
            if ("alt" in attrs) {
                return attrs["alt"].trim();
            }
        }
        if (tag === "input" ||
            tag === "select" ||
            tag === "textarea" ||
            ["textbox", "checkbox", "radio", "combobox"].includes(role || "")) {
            const inputType = (attrs["type"] || "").toLowerCase();
            if (["button", "submit", "reset"].includes(inputType)) {
                if (attrs["value"] && attrs["value"].trim()) {
                    return attrs["value"].trim();
                }
            }
            if (inputType === "image" && attrs["alt"]) {
                return attrs["alt"].trim();
            }
            if (element.labels && element.labels.length > 0) {
                const labelText = element.labels.map((l) => l.trim()).filter(Boolean).join(" ");
                if (labelText)
                    return labelText;
            }
            if (attrs["placeholder"] && attrs["placeholder"].trim()) {
                return attrs["placeholder"].trim();
            }
        }
        if (tag === "svg") {
            if (element.children) {
                for (const child of element.children) {
                    if (child.tag.toLowerCase() === "title" && child.textContent) {
                        return child.textContent.trim();
                    }
                }
            }
        }
        if (tag === "button" ||
            role === "button" ||
            tag === "a" ||
            role === "link" ||
            ["tab", "menuitem", "option"].includes(role || "")) {
            const text = this.getSubtreeText(element);
            if (text)
                return text;
        }
        if (attrs["title"] && attrs["title"].trim()) {
            return attrs["title"].trim();
        }
        return "";
    }
    getSubtreeText(element) {
        const parts = [];
        if (element.textContent && element.textContent.trim()) {
            parts.push(element.textContent.trim());
        }
        if (element.children) {
            for (const child of element.children) {
                const childTag = child.tag.toLowerCase();
                const childAttrs = child.attributes || {};
                if (childTag === "img" && childAttrs["alt"] && childAttrs["alt"].trim()) {
                    parts.push(childAttrs["alt"].trim());
                }
                else {
                    const childText = this.getSubtreeText(child);
                    if (childText)
                        parts.push(childText);
                }
            }
        }
        return parts.join(" ").trim();
    }
}
