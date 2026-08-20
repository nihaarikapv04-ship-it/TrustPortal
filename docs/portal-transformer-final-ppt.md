# Final Presentation Slide Specification: 17-Slide Deck (`docs/portal-transformer-final-ppt.md`)

> **Final PPT Specification**: 17-slide specification detailing titles, exact bullet points, required diagrams, evidence sources, speaker notes, and expected examiner questions.

---

## 1. 17-Slide Detailed Register

### **Slide 1: Title & Metadata**
- **Title**: Portal Transformer: Security-Constrained AI-Assisted Web Accessibility Remediation
- **Bullet Points**: Final-Year Dissertation Defense Presentation; Zero-Trust Client-Side DOM Architecture.
- **Visual**: Monorepo logo & architecture icon.
- **Speaker Script**: "Good morning. I am presenting Portal Transformer, a zero-trust architecture for secure AI-assisted web accessibility remediation."
- **Expected Question**: "Why is security the core focus of an accessibility tool?"

### **Slide 2: Web Accessibility Challenge**
- **Title**: The Digital Accessibility Problem
- **Bullet Points**: 70%+ public portals contain missing accessible names (WCAG 2.1 SC 1.1.1); barrier for screen-reader users.
- **Visual**: Screenshot of unlabelled icon button.
- **Speaker Script**: "Public portals frequently lack accessible text labels, preventing screen-readers from computing control names."

### **Slide 3: Motivation for AI-Assisted Remediation**
- **Title**: Motivation: Why AI is Needed
- **Bullet Points**: Static rule engines flag defects but cannot infer contextual semantic text for novel icons.
- **Visual**: Comparison table: Rule Engine vs LLM.
- **Speaker Script**: "Generative AI provides natural language comprehension required to infer icon intent from surrounding context."

### **Slide 4: The AI Security Boundary Hazard**
- **Title**: Security Risks Introduced by AI
- **Bullet Points**: Untrusted DOM text enables prompt injection; model output risks XSS, `javascript:` URIs, and navigation mutation (`href`).
- **Visual**: Diagram showing malicious page text hijacking prompt.
- **Speaker Script**: "However, introducing AI directly into the browser DOM creates severe security threats including prompt injection and credential theft."

### **Slide 5: Central Research Problem & Questions**
- **Title**: Research Problem & Questions (RQ1 - RQ7)
- **Bullet Points**: Central trade-off between accessibility remediation coverage and security-constrained automation.
- **Visual**: Scatter plot of Coverage vs Safety.
- **Speaker Script**: "Our central research question investigates what accessibility coverage can be achieved under zero unsafe mutations."

### **Slide 6: Proposed Solution & System Overview**
- **Title**: Portal Transformer Architecture
- **Bullet Points**: Client-side MV3 extension enforcing zero-trust input sanitization and capability-limited patching.
- **Visual**: High-level block diagram.
- **Speaker Script**: "Portal Transformer treats both page content and AI proposals as untrusted inputs, placing strict boundaries around DOM writes."

### **Slide 7: Architecture Flowchart & Boundaries**
- **Title**: Zero-Trust Security Pipeline
- **Bullet Points**: Privacy Firewall $\rightarrow$ Detector $\rightarrow$ Output Validator $\rightarrow$ TSIF Risk Gate $\rightarrow$ Patch Engine $\rightarrow$ TOCTOU Check.
- **Visual**: Full ASCII Architecture Diagram from [`docs/portal-transformer-final-architecture-figure.md`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/docs/portal-transformer-final-architecture-figure.md).
- **Speaker Script**: "Notice that AI model output never directly mutates the DOM—it passes through Output Validation and Patch Engine allowlists."

### **Slide 8: The Privacy Firewall Boundary**
- **Title**: Privacy Isolation & Secret Scrubbing
- **Bullet Points**: Target Intersection Firewall scrubbed password, OTP, PIN, payment, and PII fields prior to prompt dispatch.
- **Visual**: Privacy Firewall rule matrix.
- **Speaker Script**: "Privacy Firewall enforces zero secret dispatches by denying extraction on sensitive input contexts."

### **Slide 9: Capability-Limited Mutation Engine**
- **Title**: Capability-Limited Patch Engine
- **Bullet Points**: Write capability restricted strictly to `alt`, `aria-label`, `aria-labelledby`, `aria-describedby`, `role`. Navigation `href`/`src` immutable.
- **Visual**: Allowlist vs Blocklist attribute table.
- **Speaker Script**: "Attribute writes are strictly allowlisted; navigation attributes like `href` or script attributes like `onclick` are rejected."

### **Slide 10: Context-Aware SVG Resolver**
- **Title**: Context-Aware SVG Reasoning
- **Bullet Points**: Traverses parent container text to eliminate false alarms on parent-labelled icon buttons.
- **Visual**: SVG parent context traversal graph.
- **Speaker Script**: "By reasoning about parent container labels, SvgSemanticResolver eliminates false positives on standalone SVGs."

### **Slide 11: Confidence-Based Abstention**
- **Title**: Explicit Confidence-Based Abstention
- **Bullet Points**: Returns `AMBIGUOUS_ABSTAIN` when symbol definitions are incomplete; safety over speculative mutation.
- **Visual**: Abstention panel screenshot specification.
- **Speaker Script**: "When symbol graphs are ambiguous, the system abstains rather than forcing a speculative, potentially incorrect DOM mutation."

### **Slide 12: Experimental Methodology**
- **Title**: Evaluation Philosophy & Corpus Design
- **Bullet Points**: Frozen V7 implementation evaluated across synthetic, holdout, real-world, and 1,000 property security cases.
- **Visual**: Dataset manifest table.
- **Speaker Script**: "Our frozen implementation was evaluated across 930 synthetic cases, 600 holdout SVGs, 20 real-world portals, and 1,000 security property instances."

### **Slide 13: Accessibility Results**
- **Title**: Accessibility Evaluation Results
- **Bullet Points**: Synthetic v4: 100% P / 100% R ($N=930$). Holdout SVG V3: 100% P / 53.85% R / 33.33% Abstain ($N=600$). Real-world: 100% P / 77.78% R ($N=100$).
- **Visual**: Table from [`docs/portal-transformer-final-results-slide.md`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/docs/portal-transformer-final-results-slide.md).
- **Speaker Script**: "Holdout SVG recall fell to 53.85% because 33.33% of complex symbol cases triggered explicit abstention to preserve 100% precision."

### **Slide 14: Cybersecurity Evaluation Results**
- **Title**: Cybersecurity Property & Fuzzing Results
- **Bullet Points**: Property Suite ($N=1,000$): 0.0% ASR, 0 unsafe mutations. Fuzzing ($N=5,000$): 0 violations. Holdout ($N=500$): 500/500 blocked.
- **Visual**: Attack Category Block Chart.
- **Speaker Script**: "Across 1,000 property instances and 5,000 fuzz runs, zero successful attacks or unsafe mutations occurred."

### **Slide 15: Security vs. Accessibility Pareto Trade-Off**
- **Title**: Pareto Optimal Trade-Off Frontier
- **Bullet Points**: Enforcing a zero-unsafe-mutation constraint caps maximum real-world coverage at 90.0% with a 10.0% explicit abstention rate.
- **Visual**: Pareto frontier plot.
- **Speaker Script**: "Achieving zero unsafe DOM mutations requires accepting a 10% explicit abstention rate on complex public portal controls."

### **Slide 16: Research Contributions & Acknowledged Limitations**
- **Title**: Research Contributions & Limitations
- **Bullet Points**: C1-C5 Security-constrained AI remediation architecture. Limitations: Headless NVDA testing, local mock provider latency, curated sample scope.
- **Visual**: Contributions vs Limitations split table.
- **Speaker Script**: "The core contribution is establishing security-constrained AI remediation. We explicitly acknowledge headless CLI screen-reader testing limitations."

### **Slide 17: Defense Conclusion & Summary**
- **Title**: Conclusion & Dissertation Summary
- **Bullet Points**: Demonstrating secure client-side AI accessibility remediation without privacy leaks or unauthorized DOM mutations.
- **Visual**: Summary graphic & contact metadata.
- **Speaker Script**: "Thank you. I welcome your questions."
