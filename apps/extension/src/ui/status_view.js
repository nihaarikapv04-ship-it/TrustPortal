export function createStatusView() {
    const element = document.createElement("div");
    element.className = "tp-status-live-region";
    element.setAttribute("aria-live", "polite");
    element.setAttribute("aria-atomic", "true");
    element.className = "sr-only";
    const announce = (msg) => {
        element.textContent = msg;
    };
    return { element, announce };
}
