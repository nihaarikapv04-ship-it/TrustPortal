export function createEditControl(initialValue, callbacks) {
    const container = document.createElement("div");
    container.className = "tp-edit-container";
    const label = document.createElement("label");
    label.className = "tp-section-label";
    label.htmlFor = "tp-edit-input-field";
    label.textContent = "EDIT ACCESSIBLE LABEL";
    container.appendChild(label);
    const input = document.createElement("input");
    input.id = "tp-edit-input-field";
    input.type = "text";
    input.className = "tp-edit-input";
    input.value = initialValue;
    input.maxLength = 200;
    input.setAttribute("aria-label", "Edit proposed accessible label");
    container.appendChild(input);
    const counter = document.createElement("div");
    counter.className = "tp-notice";
    counter.style.margin = "4px 0";
    counter.textContent = `Characters: ${initialValue.length} / 200`;
    container.appendChild(counter);
    input.addEventListener("input", () => {
        counter.textContent = `Characters: ${input.value.length} / 200`;
    });
    const actions = document.createElement("div");
    actions.className = "tp-actions";
    const applyBtn = document.createElement("button");
    applyBtn.type = "button";
    applyBtn.className = "tp-btn tp-btn-primary";
    applyBtn.textContent = "Apply Edited Label";
    applyBtn.addEventListener("click", () => {
        callbacks.onApply(input.value);
    });
    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "tp-btn tp-btn-secondary";
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", () => {
        callbacks.onCancel();
    });
    actions.appendChild(applyBtn);
    actions.appendChild(cancelBtn);
    container.appendChild(actions);
    return container;
}
