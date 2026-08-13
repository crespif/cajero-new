import fs from "fs";
import path from "path";

export interface AppSettings {
  puntosVentaImprimibles: string[];
  puntosVentaNoImprimibles: string[];
  mostrarCuponPago: boolean;
  mesesExcluidos: number[];
}

export const DEFAULT_SETTINGS: AppSettings = {
  puntosVentaImprimibles: ["0211", "0210", "0200"],
  puntosVentaNoImprimibles: ["0220", "0221", "0224"],
  mostrarCuponPago: false,
  mesesExcluidos: [11],
};

const LOCAL_PATH = path.join(process.cwd(), "data", "settings.json");

const GIST_ID = process.env.GITHUB_GIST_ID;
const GIST_TOKEN = process.env.GITHUB_GIST_TOKEN;
const GIST_FILENAME = "settings.json";
const useRemote = !!GIST_ID && !!GIST_TOKEN;

// Cache en memoria de proceso, corta, para no pegarle a la API de GitHub en
// cada request del dashboard (rate limit) sin reintroducir el delay largo
// que tenía el cache HTTP de Next.
let cache: { settings: AppSettings; expiresAt: number } | null = null;
const CACHE_TTL_MS = 10_000;

function githubHeaders() {
  return {
    Authorization: `Bearer ${GIST_TOKEN}`,
    Accept: "application/vnd.github+json",
  };
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

  if (cache && cache.expiresAt > Date.now()) {
    return cache.settings;
  }

  try {
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: githubHeaders(),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`getSettings: GitHub respondió HTTP ${res.status}`);
      return cache?.settings ?? DEFAULT_SETTINGS;
    }
    const gist = await res.json();
    const content = gist.files?.[GIST_FILENAME]?.content;
    const settings: AppSettings = content
      ? { ...DEFAULT_SETTINGS, ...JSON.parse(content) }
      : DEFAULT_SETTINGS;
    cache = { settings, expiresAt: Date.now() + CACHE_TTL_MS };
    return settings;
  } catch (error) {
    console.error("getSettings: fetch a GitHub falló", error);
    return cache?.settings ?? DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  if (!useRemote) {
    fs.mkdirSync(path.dirname(LOCAL_PATH), { recursive: true });
    fs.writeFileSync(LOCAL_PATH, JSON.stringify(settings, null, 2), "utf-8");
    return;
  }

  const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: "PATCH",
    headers: { ...githubHeaders(), "content-type": "application/json" },
    body: JSON.stringify({
      files: { [GIST_FILENAME]: { content: JSON.stringify(settings, null, 2) } },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`No se pudo guardar la configuración (HTTP ${res.status} en GitHub Gist): ${body.slice(0, 300)}`);
  }

  cache = { settings, expiresAt: Date.now() + CACHE_TTL_MS };
}
