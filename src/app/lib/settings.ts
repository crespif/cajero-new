import fs from "fs";
import path from "path";
import { computeSessionToken } from "./adminAuth";

export interface AppSettings {
  puntosVentaImprimibles: string[];
  puntosVentaNoImprimibles: string[];
  mostrarCuponPago: boolean;
  mesesExcluidos: number[];
}

export const DEFAULT_SETTINGS: AppSettings = {
  puntosVentaImprimibles: ["0211", "0210"],
  puntosVentaNoImprimibles: ["0220", "0221", "0224"],
  mostrarCuponPago: false,
  mesesExcluidos: [11],
};

const LOCAL_PATH = path.join(process.cwd(), "data", "settings.json");
const useRemote = !!process.env.BLOB_READ_WRITE_TOKEN;

// Server Actions y Server Components no pueden importar @vercel/blob
// directamente: su dependencia undici usa sintaxis que el compilador de
// Next 14 no procesa bien fuera de un Route Handler. Por eso la lectura/
// escritura real vive en /api/admin-settings y acá solo se llama por HTTP.
function internalBaseUrl(): string {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export async function getSettings(): Promise<AppSettings> {
  if (!useRemote) {
    try {
      const raw = fs.readFileSync(LOCAL_PATH, "utf-8");
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
  try {
    const res = await fetch(`${internalBaseUrl()}/api/admin-settings`, {
      headers: { "x-internal-token": computeSessionToken() },
      next: { revalidate: 30 },
    });
    if (!res.ok) return DEFAULT_SETTINGS;
    const data = await res.json();
    return { ...DEFAULT_SETTINGS, ...data };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  if (!useRemote) {
    fs.mkdirSync(path.dirname(LOCAL_PATH), { recursive: true });
    fs.writeFileSync(LOCAL_PATH, JSON.stringify(settings, null, 2), "utf-8");
    return;
  }
  const res = await fetch(`${internalBaseUrl()}/api/admin-settings`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      "x-internal-token": computeSessionToken(),
    },
    body: JSON.stringify(settings),
  });
  if (!res.ok) {
    throw new Error("No se pudo guardar la configuración");
  }
}
