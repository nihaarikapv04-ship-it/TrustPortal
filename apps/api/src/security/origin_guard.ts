export function isValidOrigin(origin: string, isDev: boolean = true): boolean {
  if (!origin || typeof origin !== "string") return false;

  const trimmed = origin.trim().toLowerCase();

  // Hard rejection for dangerous protocols or embedded credentials
  if (
    trimmed.startsWith("javascript:") ||
    trimmed.startsWith("data:") ||
    trimmed.startsWith("file:") ||
    trimmed.includes("@")
  ) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:" || parsed.protocol === "chrome-extension:") return true;
    if (isDev && (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1")) {
      return true;
    }
  } catch (e) {
    return false;
  }

  return false;
}
