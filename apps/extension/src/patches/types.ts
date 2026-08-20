/**
 * Placeholder Interfaces for Future Detector and Patch Applicator Steps.
 * Avoids performative fake detection while establishing clean architecture boundaries.
 */

export interface CandidateElement {
  element: Element;
  tag: string;
  role: string | null;
  id: string | null;
}

export interface PatchApplicatorInterface {
  applyPatch(element: Element, patch: any): boolean;
  revertPatch(element: Element, patch: any): boolean;
}
