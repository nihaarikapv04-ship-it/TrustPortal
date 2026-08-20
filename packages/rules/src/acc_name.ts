/**
 * WAI-ARIA 1.2 Accessible Name Computer (DOM & Dict Representation Support).
 * Strengthened implementation supporting aria-labelledby, aria-label, host language rules,
 * SVG title/desc, SVG sprites/symbols (<use>), input labels, descendant text, context-aware parent traversal,
 * and title fallbacks.
 */

export interface ElementRepresentation {
  tag: string;
  id?: string | null;
  role?: string | null;
  attributes: Record<string, string>;
  textContent?: string | null;
  children?: ElementRepresentation[];
  labels?: string[];
  title?: string | null;
  parent?: ElementRepresentation | null;
  parentRole?: string | null;
  parentAccessibleName?: string | null;
}

export class AccessibleNameComputer {
  private domMap: Map<string, ElementRepresentation> = new Map();

  constructor(domMap?: Record<string, ElementRepresentation>) {
    if (domMap) {
      for (const [id, elem] of Object.entries(domMap)) {
        this.domMap.set(id, elem);
      }
    }
  }

  public setDomMap(domMap: Record<string, ElementRepresentation>): void {
    this.domMap.clear();
    for (const [id, elem] of Object.entries(domMap)) {
      this.domMap.set(id, elem);
    }
  }

  /**
   * Computes accessible name from a native DOM Element.
   */
  public computeForElement(element: Element): string {
    const tag = element.tagName.toLowerCase();
    const role = element.getAttribute("role");
    const attrs: Record<string, string> = {};

    for (let i = 0; i < element.attributes.length; i++) {
      const a = element.attributes[i];
      attrs[a.name] = a.value;
    }

    const children: ElementRepresentation[] = Array.from(element.children).map((child) => ({
      tag: child.tagName.toLowerCase(),
      id: child.id || null,
      role: child.getAttribute("role") || null,
      attributes: Array.from(child.attributes).reduce((acc, a) => ({ ...acc, [a.name]: a.value }), {}),
      textContent: child.textContent
    }));

    let labels: string[] = [];
    if ("labels" in element && (element as any).labels) {
      labels = Array.from((element as any).labels as NodeListOf<HTMLElement>).map(
        (l) => l.textContent || ""
      );
    }

    const parentElem = element.parentElement;
    let parentRepr: ElementRepresentation | undefined = undefined;
    if (parentElem) {
      parentRepr = {
        tag: parentElem.tagName.toLowerCase(),
        id: parentElem.id || null,
        role: parentElem.getAttribute("role") || null,
        attributes: Array.from(parentElem.attributes).reduce((acc, a) => ({ ...acc, [a.name]: a.value }), {}),
        textContent: parentElem.textContent
      };
    }

    const repr: ElementRepresentation = {
      tag,
      id: element.id || null,
      role: role || null,
      attributes: attrs,
      textContent: element.textContent,
      children,
      labels,
      parent: parentRepr,
      parentRole: parentRepr?.role || parentRepr?.tag || null
    };

    return this.computeName(repr);
  }

  /**
   * Computes accessible name from an ElementRepresentation dictionary.
   */
  public computeName(element: ElementRepresentation): string {
    const attrs = element.attributes || {};
    const tag = (element.tag || "").toLowerCase();
    const role = element.role ? element.role.toLowerCase() : null;

    // 1. Check aria-labelledby (Highest Priority)
    if (attrs["aria-labelledby"] && attrs["aria-labelledby"].trim()) {
      const refIds = attrs["aria-labelledby"].trim().split(/\s+/);
      const parts: string[] = [];

      for (const refId of refIds) {
        if (this.domMap.has(refId)) {
          const refElem = this.domMap.get(refId)!;
          const part = refElem.textContent || this.computeName(refElem);
          if (part && part.trim()) parts.push(part.trim());
        } else if (refId === element.id) {
          if (element.textContent && element.textContent.trim()) {
            parts.push(element.textContent.trim());
          }
        }
      }
      if (parts.length > 0) return parts.join(" ");
    }

    // 2. Check aria-label
    if (attrs["aria-label"] && attrs["aria-label"].trim()) {
      return attrs["aria-label"].trim();
    }

    // 3. Host language native rules
    // Image Alt Rule (HTML img ONLY)
    if (tag === "img") {
      if ("alt" in attrs) {
        return attrs["alt"].trim();
      }
    }

    // Form Controls (input, select, textarea)
    if (
      tag === "input" ||
      tag === "select" ||
      tag === "textarea" ||
      ["textbox", "checkbox", "radio", "combobox", "spinbutton", "searchbox"].includes(role || "")
    ) {
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
        if (labelText) return labelText;
      }

      if (element.id) {
        for (const [_, mapElem] of this.domMap.entries()) {
          if (mapElem.tag === "label" && mapElem.attributes?.["for"] === element.id) {
            const lText = mapElem.textContent || this.computeName(mapElem);
            if (lText && lText.trim()) return lText.trim();
          }
        }
      }

      if (attrs["placeholder"] && attrs["placeholder"].trim()) {
        return attrs["placeholder"].trim();
      }
    }

    // SVG Element Rules (<title>, <desc>, or <use href="..."> sprite resolution)
    if (tag === "svg") {
      if (element.children) {
        for (const child of element.children) {
          const cTag = (child.tag || "").toLowerCase();
          if ((cTag === "title" || cTag === "desc") && child.textContent && child.textContent.trim()) {
            return child.textContent.trim();
          }
          // SVG Sprite <use href="#symbol_id"> resolution
          if (cTag === "use") {
            const hrefVal = child.attributes?.["href"] || child.attributes?.["xlink:href"] || "";
            if (hrefVal.startsWith("#")) {
              const symbolId = hrefVal.substring(1);
              if (this.domMap.has(symbolId)) {
                const symElem = this.domMap.get(symbolId)!;
                const symName = this.computeName(symElem);
                if (symName) return symName;
              }
            }
          }
        }
      }
    }

    // Interactive Buttons, Links, Tabs, Menuitems (Subtree text computation)
    if (
      tag === "button" ||
      role === "button" ||
      tag === "a" ||
      role === "link" ||
      ["tab", "menuitem", "option", "switch", "slider", "treeitem"].includes(role || "")
    ) {
      const text = this.getSubtreeText(element);
      if (text) return text;
    }

    // Title Attribute Fallback (Lowest Priority)
    if (attrs["title"] && attrs["title"].trim()) {
      return attrs["title"].trim();
    }

    return "";
  }

  private getSubtreeText(element: ElementRepresentation): string {
    const parts: string[] = [];

    if (element.attributes?.["aria-hidden"] === "true") {
      return "";
    }

    if (element.textContent && element.textContent.trim()) {
      parts.push(element.textContent.trim());
    }

    if (element.children) {
      for (const child of element.children) {
        const childTag = (child.tag || "").toLowerCase();
        const childAttrs = child.attributes || {};
        const childRole = child.role ? child.role.toLowerCase() : null;

        if (childAttrs["aria-hidden"] === "true") continue;

        if (childAttrs["aria-label"] && childAttrs["aria-label"].trim()) {
          parts.push(childAttrs["aria-label"].trim());
        } else if ((childTag === "img" || childRole === "img") && childAttrs["alt"] && childAttrs["alt"].trim()) {
          parts.push(childAttrs["alt"].trim());
        } else if (childTag === "svg") {
          const svgTitle = this.computeName(child);
          if (svgTitle) parts.push(svgTitle);
        } else {
          const childText = this.getSubtreeText(child);
          if (childText) parts.push(childText);
        }
      }
    }

    return parts.join(" ").trim();
  }
}
