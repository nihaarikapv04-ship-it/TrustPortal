# 60-Second Master Project Pitch (`docs/portal-transformer-60-second-pitch.md`)

> **60-Second Pitch Script**: Concise spoken script answering Problem, Gap, Solution, Novelty, Validation, and Limitation in 60 seconds without exaggerated language.

---

## 1. Spoken Script (60 Seconds / ~150 Words)

"Over 70% of public service web portals fail basic WCAG accessibility standards due to unlabelled icon buttons and missing image alts. While screen-reader users rely on accessible names, existing rule engines can only flag defects—they cannot infer contextual semantic text. 

Generative AI offers natural language comprehension to repair these defects, but introducing AI directly into the browser DOM creates severe security threats, including prompt injection, XSS, and credential theft.

My project, **Portal Transformer**, introduces a zero-trust, security-constrained client-side architecture. It treats both web page content and AI model responses as untrusted inputs. Sensitive data is scrubbed by a Privacy Firewall, while AI model outputs pass through client-side validators and capability allowlists—restricting writes strictly to accessibility attributes like `aria-label`. 

Evaluated across 1,000 security attack cases and 20 public portals, the system achieved 100% precision and 0% attack success. Its main limitation is reduced recall on complex SVG symbols where explicit abstention is enforced to preserve safety."
