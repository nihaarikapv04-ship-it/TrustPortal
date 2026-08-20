"""
WAI-ARIA 1.2 Accessible Name & Description Computation Engine.
Spec-compliant algorithm for computing accessible names and descriptions for DOM elements.
"""

from typing import Dict, Any, Optional, List
import re


class AccessibleNameComputer:
    """
    Computes the accessible name of an element per WAI-ARIA 1.2 specification rules.
    Order of precedence:
    1. aria-labelledby
    2. aria-label
    3. Host language attributes (alt, title, label element, svg title/desc)
    4. Subtree content (for role=button, role=link, etc.)
    5. Tooltip / title attribute fallback
    """

    def __init__(self, dom_map: Optional[Dict[str, Dict[str, Any]]] = None):
        """
        dom_map: Optional map of element id -> element attributes/content dictionary
        to resolve aria-labelledby references.
        """
        self.dom_map = dom_map or {}

    def compute_name(self, element: Dict[str, Any]) -> str:
        """
        Computes the accessible name for a given element dictionary representation.
        Element dictionary structure:
        {
            "tag": str,
            "id": Optional[str],
            "role": Optional[str],
            "attributes": Dict[str, str],
            "text_content": Optional[str],
            "children": List[Dict[str, Any]],
            "labels": List[str],  # associated label element texts
            "title": Optional[str]
        }
        """
        attrs = element.get("attributes", {})
        tag = element.get("tag", "").lower()
        role = element.get("role", "").lower() if element.get("role") else None

        # 1. Check aria-labelledby
        if "aria-labelledby" in attrs and attrs["aria-labelledby"].strip():
            ref_ids = attrs["aria-labelledby"].split()
            parts = []
            for ref_id in ref_ids:
                if ref_id in self.dom_map:
                    ref_elem = self.dom_map[ref_id]
                    # Direct text content or recursive name computation
                    part = ref_elem.get("text_content") or self.compute_name(ref_elem)
                    if part:
                        parts.append(part.strip())
                elif ref_id == element.get("id"):
                    # Self reference, use text content if present
                    if element.get("text_content"):
                        parts.append(element["text_content"].strip())
            if parts:
                return " ".join(parts)

        # 2. Check aria-label
        if "aria-label" in attrs and attrs["aria-label"].strip():
            return attrs["aria-label"].strip()

        # 3. Host language native rules based on tag / role
        # Image / img / role="img"
        if tag == "img" or role == "img":
            if "alt" in attrs:
                # alt="" means explicitly present but empty (decorative)
                return attrs["alt"].strip()

        # Input / Form elements
        if tag in ("input", "select", "textarea") or role in ("textbox", "checkbox", "radio", "combobox"):
            # Type-specific attributes
            input_type = attrs.get("type", "").lower()
            if input_type in ("button", "submit", "reset"):
                if "value" in attrs and attrs["value"].strip():
                    return attrs["value"].strip()
            if input_type == "image":
                if "alt" in attrs and attrs["alt"].strip():
                    return attrs["alt"].strip()
            
            # Associated <label> text
            if element.get("labels"):
                label_text = " ".join([l.strip() for l in element["labels"] if l.strip()])
                if label_text:
                    return label_text

            # placeholder as fallback name (when no other name exists)
            if "placeholder" in attrs and attrs["placeholder"].strip():
                return attrs["placeholder"].strip()

        # SVG elements
        if tag == "svg":
            # Search children for <title>
            for child in element.get("children", []):
                if child.get("tag", "").lower() == "title" and child.get("text_content"):
                    return child["text_content"].strip()

        # Native button or role="button"
        if tag == "button" or role == "button":
            # Check text content or children text / img alt
            text = self._get_subtree_text(element)
            if text:
                return text

        # Native anchor <a> or role="link"
        if tag == "a" or role == "link":
            text = self._get_subtree_text(element)
            if text:
                return text

        # Subtree fallback for other interactive components
        if role in ("tab", "menuitem", "option", "treeitem"):
            text = self._get_subtree_text(element)
            if text:
                return text

        # 4. title attribute as final fallback name
        if "title" in attrs and attrs["title"].strip():
            return attrs["title"].strip()
        if element.get("title") and element["title"].strip():
            return element["title"].strip()

        return ""

    def _get_subtree_text(self, element: Dict[str, Any]) -> str:
        """Extracts text from element subtree including img alt text."""
        parts = []
        if element.get("text_content") and element["text_content"].strip():
            parts.append(element["text_content"].strip())

        for child in element.get("children", []):
            child_tag = child.get("tag", "").lower()
            child_attrs = child.get("attributes", {})
            if child_tag == "img" and "alt" in child_attrs and child_attrs["alt"].strip():
                parts.append(child_attrs["alt"].strip())
            else:
                child_text = self._get_subtree_text(child)
                if child_text:
                    parts.append(child_text)

        return " ".join(parts).strip()
