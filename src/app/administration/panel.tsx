"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateAdminSettings, logoutAdmin } from "../lib/adminActions";
import type { AppSettings } from "../lib/settings";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

type PvList = "puntosVentaImprimibles" | "puntosVentaNoImprimibles";

export default function AdminPanel({ initialSettings }: { initialSettings: AppSettings }) {
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [pvImprimible, setPvImprimible] = useState("");
  const [pvNoImprimible, setPvNoImprimible] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const addPv = (list: PvList, value: string, clear: () => void) => {
    const v = value.trim();
    if (!v || settings[list].includes(v)) return;
    setSettings({ ...settings, [list]: [...settings[list], v] });
    clear();
  };

  const removePv = (list: PvList, value: string) => {
    setSettings({ ...settings, [list]: settings[list].filter((v) => v !== value) });
  };

  const toggleMes = (mes: number) => {
    setSettings((s) => ({
      ...s,
      mesesExcluidos: s.mesesExcluidos.includes(mes)
        ? s.mesesExcluidos.filter((m) => m !== mes)
        : [...s.mesesExcluidos, mes],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    const res = await updateAdminSettings(settings);
    setSaving(false);
    setMessage(res.ok ? "Guardado." : "Error al guardar. Volvé a iniciar sesión.");
  };

  const handleLogout = async () => {
    await logoutAdmin();
    router.refresh();
  };

  return (
    <div className="mx-auto p-6 flex flex-col gap-6" style={{ maxWidth: 560 }}>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Panel de administración</h1>
        <button onClick={handleLogout} className="text-sm underline">Salir</button>
      </div>

      <section className="flex flex-col gap-2">
        <h2 className="font-medium">Puntos de venta imprimibles</h2>
        <p className="text-sm" style={{ color: "var(--c-muted)" }}>
          Determinan qué factura se muestra/imprime cuando hay varias agrupadas.
        </p>
        <div className="flex flex-wrap gap-2">
          {settings.puntosVentaImprimibles.map((pv) => (
            <span key={pv} className="inv-btn">
              {pv}
              <button type="button" onClick={() => removePv("puntosVentaImprimibles", pv)} className="ml-1" aria-label={`Quitar ${pv}`}>
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={pvImprimible}
            onChange={(e) => setPvImprimible(e.target.value)}
            placeholder="ej. 0211"
            className="border rounded px-2 py-1"
            maxLength={4}
          />
          <button type="button" onClick={() => addPv("puntosVentaImprimibles", pvImprimible, () => setPvImprimible(""))} className="inv-btn">
            Agregar
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-medium">Puntos de venta no energéticos</h2>
        <p className="text-sm" style={{ color: "var(--c-muted)" }}>
          Se priorizan como comprobante representativo del pago cuando están presentes.
        </p>
        <div className="flex flex-wrap gap-2">
          {settings.puntosVentaNoImprimibles.map((pv) => (
            <span key={pv} className="inv-btn">
              {pv}
              <button type="button" onClick={() => removePv("puntosVentaNoImprimibles", pv)} className="ml-1" aria-label={`Quitar ${pv}`}>
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={pvNoImprimible}
            onChange={(e) => setPvNoImprimible(e.target.value)}
            placeholder="ej. 0224"
            className="border rounded px-2 py-1"
            maxLength={4}
          />
          <button type="button" onClick={() => addPv("puntosVentaNoImprimibles", pvNoImprimible, () => setPvNoImprimible(""))} className="inv-btn">
            Agregar
          </button>
        </div>
      </section>

      <section className="flex items-center gap-2">
        <input
          type="checkbox"
          id="mostrarCupon"
          checked={settings.mostrarCuponPago}
          onChange={(e) => setSettings({ ...settings, mostrarCuponPago: e.target.checked })}
        />
        <label htmlFor="mostrarCupon">Mostrar botón de cupón de pago</label>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="font-medium">Meses a excluir del listado</h2>
        <div className="flex flex-wrap gap-2">
          {MESES.map((nombre, i) => {
            const mes = i + 1;
            const active = settings.mesesExcluidos.includes(mes);
            return (
              <button
                key={mes}
                type="button"
                onClick={() => toggleMes(mes)}
                className="inv-btn"
                style={active ? { background: "var(--c-warn, #f59e0b)", color: "#fff" } : undefined}
              >
                {nombre}
              </button>
            );
          })}
        </div>
      </section>

      <button onClick={handleSave} disabled={saving} className="home-btn">
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
      {message && <p className="text-sm text-center">{message}</p>}
    </div>
  );
}
