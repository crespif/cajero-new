"use server";

import { cookies } from "next/headers";
import { getSettings, saveSettings, AppSettings } from "./settings";
import { ADMIN_COOKIE_NAME, computeSessionToken, isValidPassword, isValidSessionToken } from "./adminAuth";

export async function loginAdmin(password: string): Promise<{ ok: boolean }> {
  if (!isValidPassword(password)) return { ok: false };
  cookies().set(ADMIN_COOKIE_NAME, computeSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 12,
    path: "/",
  });
  return { ok: true };
}

export async function logoutAdmin(): Promise<void> {
  cookies().delete(ADMIN_COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return isValidSessionToken(cookies().get(ADMIN_COOKIE_NAME)?.value);
}

export async function updateAdminSettings(settings: AppSettings): Promise<{ ok: boolean }> {
  if (!isValidSessionToken(cookies().get(ADMIN_COOKIE_NAME)?.value)) return { ok: false };
  saveSettings(settings);
  return { ok: true };
}

export async function getAdminSettings(): Promise<AppSettings> {
  return getSettings();
}
