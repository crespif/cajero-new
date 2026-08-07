import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "admin_session";

function getAdminPassword(): string {
  return process.env.ADMIN_PANEL_PASSWORD || "celta-admin-2026";
}

export function isValidPassword(password: string): boolean {
  return password === getAdminPassword();
}

export function computeSessionToken(): string {
  return crypto.createHmac("sha256", getAdminPassword()).update("admin-panel-session").digest("hex");
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  return token === computeSessionToken();
}
