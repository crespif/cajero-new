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
  // La URL efímera *.vercel.app (VERCEL_URL) queda detrás de Vercel
  // Authentication (SSO) en este proyecto, así que un fetch propio a esa URL
  // se bloquea antes de llegar a nuestra ruta. El dominio de producción no
  // tiene esa protección, así que lo usamos ahí en vez de VERCEL_URL.
  if (process.env.APP_BASE_URL) return process.env.APP_BASE_URL;
  if (process.env.VERCEL_ENV === "production") return "https://cajeroenlinea.celtatsas.com.ar";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function internalHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    "x-internal-token": computeSessionToken(),
    ...extra,
  };
  // Si tenés "Deployment Protection" activo en Vercel, un fetch a tu propia
  // URL interna se bloquea con 401 antes de llegar acá. Generá un secreto en
  // Settings → Deployment Protection → Protection Bypass for Automation y
  // cargalo como env var VERCEL_AUTOMATION_BYPASS_SECRET para saltearlo.
  if (process.env.VERCEL_AUTOMATION_BYPASS_SECRET) {
    headers["x-vercel-protection-bypass"] = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  }
  return headers;
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
      headers: internalHeaders(),
      next: { revalidate: 30 },
    });
    if (!res.ok) {
      console.error(`getSettings: HTTP ${res.status} en ${res.url}`);
      return DEFAULT_SETTINGS;
    }
    const data = await res.json();
    return { ...DEFAULT_SETTINGS, ...data };
  } catch (error) {
    console.error("getSettings: fetch falló", error);
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
    headers: internalHeaders({ "content-type": "application/json" }),
    body: JSON.stringify(settings),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`No se pudo guardar la configuración (HTTP ${res.status} en ${res.url}): ${body.slice(0, 300)}`);
  }
}
