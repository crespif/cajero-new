import fs from "fs";
import path from "path";
import { put, head } from "@vercel/blob";

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

const BLOB_PATHNAME = "settings.json";
const LOCAL_PATH = path.join(process.cwd(), "data", "settings.json");
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function getSettings(): Promise<AppSettings> {
  if (useBlob) {
    try {
      const blob = await head(BLOB_PATHNAME);
      const res = await fetch(blob.url, { cache: "no-store" });
      const data = await res.json();
      return { ...DEFAULT_SETTINGS, ...data };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
  try {
    const raw = fs.readFileSync(LOCAL_PATH, "utf-8");
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  if (useBlob) {
    await put(BLOB_PATHNAME, JSON.stringify(settings, null, 2), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }
  fs.mkdirSync(path.dirname(LOCAL_PATH), { recursive: true });
  fs.writeFileSync(LOCAL_PATH, JSON.stringify(settings, null, 2), "utf-8");
}
