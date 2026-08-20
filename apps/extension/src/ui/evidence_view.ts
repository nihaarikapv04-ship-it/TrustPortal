import { EvidenceItem } from "@trustportal/schemas";

export function createEvidenceView(evidenceItems: EvidenceItem[]): HTMLElement {
  const container = document.createElement("div");
  container.className = "tp-evidence-container";

  const label = document.createElement("div");
  label.className = "tp-section-label";
  label.textContent = "VERIFIABLE EVIDENCE";
  container.appendChild(label);

  const list = document.createElement("ul");
  list.className = "tp-evidence-list";

  if (!evidenceItems || evidenceItems.length === 0) {
    const empty = document.createElement("li");
    empty.className = "tp-evidence-item";
    empty.textContent = "• Rule-based structural defect detection";
    list.appendChild(empty);
  } else {
    for (const item of evidenceItems) {
      const li = document.createElement("li");
      li.className = "tp-evidence-item";

      const check = document.createElement("span");
      check.style.color = "#16a34a";
      check.textContent = "✓";

      const text = document.createElement("span");
      // Safe text node rendering (Zero innerHTML!)
      text.textContent = `${item.source}: "${item.quote}"`;

      li.appendChild(check);
      li.appendChild(text);
      list.appendChild(li);
    }
  }

  container.appendChild(list);
  return container;
}
