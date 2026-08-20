export interface EditControlCallbacks {
    onApply: (editedValue: string) => void;
    onCancel: () => void;
}
export declare function createEditControl(initialValue: string, callbacks: EditControlCallbacks): HTMLElement;
//# sourceMappingURL=edit_control.d.ts.map