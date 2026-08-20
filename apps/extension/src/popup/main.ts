import { policyStorage } from "../policy/storage.js";

document.addEventListener("DOMContentLoaded", async () => {
  const originText = document.getElementById("origin-text") as HTMLElement;
  const statusBadge = document.getElementById("status-badge") as HTMLElement;
  const issuesCount = document.getElementById("issues-count") as HTMLElement;
  const proposalsCount = document.getElementById("proposals-count") as HTMLElement;
  const repairsCount = document.getElementById("repairs-count") as HTMLElement;
  const toggleBtn = document.getElementById("toggle-btn") as HTMLButtonElement;
  const settingsBtn = document.getElementById("settings-btn") as HTMLButtonElement;

  let currentOrigin = "https://example.com";

  // Query active tab URL if available in chrome environment
  if (typeof chrome !== "undefined" && chrome.tabs && chrome.tabs.query) {
    try {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (activeTab && activeTab.url) {
        const url = new URL(activeTab.url);
        currentOrigin = url.origin;
      }
    } catch (e) {
      console.warn("Could not query active tab origin:", e);
    }
  }

  if (originText) originText.textContent = currentOrigin;

  async function updateUI() {
    const status = await policyStorage.getSiteStatus(currentOrigin);

    if (statusBadge) {
      if (status.enabled) {
        statusBadge.textContent = "Active";
        statusBadge.className = "badge badge-active";
      } else {
        statusBadge.textContent = "Disabled";
        statusBadge.className = "badge badge-disabled";
      }
    }

    if (issuesCount) issuesCount.textContent = String(status.issuesDetected);
    if (proposalsCount) proposalsCount.textContent = String(status.proposalsPending);
    if (repairsCount) repairsCount.textContent = String(status.repairsApplied);

    if (toggleBtn) {
      if (status.enabled) {
        toggleBtn.textContent = "Disable for this site";
        toggleBtn.className = "btn btn-toggle";
        toggleBtn.setAttribute("aria-pressed", "true");
      } else {
        toggleBtn.textContent = "Enable for this site";
        toggleBtn.className = "btn btn-secondary";
        toggleBtn.setAttribute("aria-pressed", "false");
      }
    }
  }

  toggleBtn.addEventListener("click", async () => {
    const status = await policyStorage.getSiteStatus(currentOrigin);
    await policyStorage.setSiteEnabled(currentOrigin, !status.enabled);
    await updateUI();
  });

  settingsBtn.addEventListener("click", () => {
    alert("TrustPortal Settings placeholder.");
  });

  await updateUI();
});
