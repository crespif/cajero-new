import fs from "fs";
import path from "path";

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

const SETTINGS_PATH = path.join(process.cwd(), "data", "settings.json");

export function getSettings(): AppSettings {
  try {
    const raw = fs.readFileSync(SETTINGS_PATH, "utf-8");
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings) {
  fs.mkdirSync(path.dirname(SETTINGS_PATH), { recursive: true });
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), "utf-8");
}
