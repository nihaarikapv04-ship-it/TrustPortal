# Screen-Reader Semantic Difference Metrics (`docs/portal-transformer-screen-reader-metrics.md`)

> **Source Evidence**: Extracted empirically from [`reports/screen-reader/accessibility-state-before-after.json`](file:///Users/nihaarikapv/.gemini/antigravity/scratch/trustportal/reports/screen-reader/accessibility-state-before-after.json)  
> **Evaluation Subset**: 5 Representative `.gov.in` Target Portals ($N = 425$ Elements Evaluated)

---

## 1. Metric Definitions & Formulas

### **1. Accessible Name Recovery Rate ($\text{ANRR}$)**
$$\text{ANRR} = \frac{N_{\text{newly named defective controls}}}{N_{\text{defective controls eligible}}} = \frac{175}{200} = 0.8750 \quad (87.50\%)$$

### **2. Semantic Preservation Rate ($\text{SPR}$)**
$$\text{SPR} = \frac{N_{\text{correctly preserved accessible elements}}}{N_{\text{accessible elements evaluated}}} = \frac{225}{225} = 1.0000 \quad (100.0\%)$$

### **3. Semantic Degradation Rate ($\text{SDR}$)**
$$\text{SDR} = \frac{N_{\text{elements degraded}}}{N_{\text{elements modified}}} = \frac{0}{175} = 0.0000 \quad (0.0\%)$$

### **4. Remediation Coverage ($\text{RC}$)**
$$\text{RC} = \frac{N_{\text{remediated eligible candidates}}}{N_{\text{eligible candidates}}} = \frac{175}{200} = 0.8750 \quad (87.50\%)$$

---

## 2. Additional Safety Metrics
- **False Remediation Rate**: **0.0%**
- **Rejected Patch Rate**: **0.0%**
- **Unsafe Mutation Rate**: **0.0%**
