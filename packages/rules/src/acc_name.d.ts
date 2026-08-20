/**
 * WAI-ARIA 1.2 Accessible Name Computer (DOM & Dict Representation Support).
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
}
export declare class AccessibleNameComputer {
    private domMap;
    constructor(domMap?: Record<string, ElementRepresentation>);
    /**
     * Computes accessible name from a native DOM Element.
     */
    computeForElement(element: Element): string;
    /**
     * Computes accessible name from an ElementRepresentation dictionary.
     */
    computeName(element: ElementRepresentation): string;
    private getSubtreeText;
}
//# sourceMappingURL=acc_name.d.ts.map