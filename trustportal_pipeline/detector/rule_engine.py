"""
Deterministic Rule Engine for Accessibility Defect Detection.
This module is the ONLY component allowed to assert that an accessibility defect exists.
It uses deterministic rules and accessible name computation (WAI-ARIA 1.2).
It never calls AI models.
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field
import hashlib
from trustportal_pipeline.detector.acc_name_comp import AccessibleNameComputer


@dataclass(frozen=True)
class Defect:
    defect_id: str
    issue_type: str  # "img-alt" | "button-name" | "link-name" | "form-label" | "svg-name" | "table-header" | "custom-control"
    element_fingerprint: str
    selector: str
    tag: str
    role: Optional[str]
    attributes: Dict[str, str]
    current_accessible_name: str
    surrounding_context: Dict[str, Any]  # Includes ancestor text, headings, hidden text


class DeterministicRuleEngine:
    """
    Scans a DOM representation and extracts accessibility defects with structural context.
    """

    def __init__(self):
        pass

    def scan_dom(self, elements: List[Dict[str, Any]], dom_map: Optional[Dict[str, Dict[str, Any]]] = None) -> List[Defect]:
        """
        Scans a list of element dicts for accessibility defects.
        """
        computer = AccessibleNameComputer(dom_map=dom_map)
        defects: List[Defect] = []

        for elem in elements:
            tag = elem.get("tag", "").lower()
            role = elem.get("role", "").lower() if elem.get("role") else None
            attrs = elem.get("attributes", {})
            acc_name = computer.compute_name(elem)

            # Issue Type 1: img-alt
            if tag == "img" or role == "img":
                if "alt" not in attrs and not attrs.get("aria-label") and not attrs.get("aria-labelledby"):
                    defects.append(self._build_defect("img-alt", elem, acc_name))

            # Issue Type 2: button-name
            elif tag == "button" or role == "button" or (tag == "input" and attrs.get("type", "").lower() in ("button", "submit", "reset", "image")):
                if not acc_name:
                    defects.append(self._build_defect("button-name", elem, acc_name))

            # Issue Type 3: link-name
            elif tag == "a" or role == "link":
                if not acc_name:
                    defects.append(self._build_defect("link-name", elem, acc_name))

            # Issue Type 4: form-label
            elif tag in ("input", "select", "textarea") and attrs.get("type", "").lower() not in ("hidden", "button", "submit", "reset", "image"):
                if not acc_name:
                    defects.append(self._build_defect("form-label", elem, acc_name))

            # Issue Type 5: svg-name (when interactive or role=img)
            elif tag == "svg":
                if (role in ("img", "button", "graphics-symbol") or attrs.get("tabindex") == "0") and not acc_name:
                    defects.append(self._build_defect("svg-name", elem, acc_name))

            # Issue Type 6: table-header
            elif tag == "table":
                # Check if headers exist for data table
                has_th = any(child.get("tag", "").lower() == "th" for child in elem.get("children", []))
                if not has_th and len(elem.get("children", [])) > 1:
                    defects.append(self._build_defect("table-header", elem, acc_name))

            # Issue Type 7: custom-control
            elif role in ("checkbox", "radio", "combobox", "tab", "menuitem", "slider", "switch"):
                if not acc_name:
                    defects.append(self._build_defect("custom-control", elem, acc_name))

        return defects

    def _build_defect(self, issue_type: str, elem: Dict[str, Any], acc_name: str) -> Defect:
        tag = elem.get("tag", "").lower()
        role = elem.get("role")
        attrs = elem.get("attributes", {})
        selector = elem.get("selector") or f"{tag}#{elem.get('id')}" if elem.get("id") else f"{tag}"
        
        fingerprint_raw = f"{issue_type}:{selector}:{attrs.get('src', '')}:{attrs.get('id', '')}"
        fingerprint = hashlib.sha256(fingerprint_raw.encode("utf-8")).hexdigest()[:16]
        defect_id = f"def_{fingerprint}"

        # Context extraction: includes surrounding text, headings, parent text, and hidden text
        surrounding_context = {
            "nearest_heading": elem.get("nearest_heading", ""),
            "parent_text": elem.get("parent_text", ""),
            "sibling_text": elem.get("sibling_text", ""),
            "hidden_text": elem.get("hidden_text", ""),  # Extracts display:none context to detect hidden injections!
            "page_title": elem.get("page_title", ""),
            "url_path": elem.get("url_path", ""),
        }

        return Defect(
            defect_id=defect_id,
            issue_type=issue_type,
            element_fingerprint=fingerprint,
            selector=selector,
            tag=tag,
            role=role,
            attributes=attrs,
            current_accessible_name=acc_name,
            surrounding_context=surrounding_context,
        )
