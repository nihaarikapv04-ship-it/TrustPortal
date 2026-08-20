import { TrustQRApp } from "./ui/app.js";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("app");
  if (container) {
    const app = new TrustQRApp(container);
    app.render();
  }
});
