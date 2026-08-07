"use client";

import { Cliente, Factura, FacturaPagas } from "../lib/definitions";
import type { AppSettings } from "../lib/settings";
import { pickComprobantePagas } from "../lib/comprobante";
import { useEffect, useState } from "react";
import ListInvoice from "./list";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

function groupFacturasPagas(pagas: FacturaPagas[]): FacturaPagas[] {
  const groups = new Map<string, FacturaPagas[]>();
  for (const p of pagas) {
    const key = [p.CompFec, p.CompVto, p.CliCod, p.SumNro].join("|");
    const group = groups.get(key);
    if (group) group.push(p);
    else groups.set(key, [p]);
  }
  return Array.from(groups.values()).map((group) => {
    if (group.length === 1) return group[0];
    return {
      ...group[0],
      CompImp: group.reduce((sum, p) => sum + p.CompImp, 0),
      CompSdo: group.reduce((sum, p) => sum + p.CompSdo, 0),
      pagas: group,
    };
  });
}

export default function SelectSumin({
  clientes,
  facturas,
  settings,
}: {
  clientes: Cliente[];
  facturas: Factura[];
  settings: AppSettings;
}) {
  const [client, setClient] = useState(clientes[0]);
  const monthExclude = settings.mesesExcluidos;

  const [facts, setFacts] = useState(
    facturas.filter(
      (f) =>
        f.CuentaNIS === client.CuentaNIS &&
        !monthExclude.includes(new Date(f.FacturaFV).getMonth() + 1)
    )
  );

  const [factsPagas, setFactsPagas] = useState<FacturaPagas[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPagas = async () => {
      try {
        const res = await fetch(
          `/api/factura/pagas?cta=${client.PersonaNro}&sum=${client.CuentaNro}`
        );
        const data = await res.json();
        data.sort(
          (a: FacturaPagas, b: FacturaPagas) =>
            new Date(b.CompVto).getTime() - new Date(a.CompVto).getTime()
        );
        setFactsPagas(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pagas:", error);
      }
    };
    fetchPagas();
  }, [client.PersonaNro, client.CuentaNro]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = clientes.find((c) => c.CuentaNIS === e.target.value)!;
    setFacts(
      facturas.filter(
        (f) =>
          f.CuentaNIS === selected.CuentaNIS &&
          !monthExclude.includes(new Date(f.FacturaFV).getMonth() + 1)
      )
    );
    setClient(selected);
  };

  return (
    <>
      <div className="dash-header">
        <p className="dash-client-name">
          {client.CuentaDoc} · <strong>{client.CuentaNom}</strong>
        </p>
        <select className="dash-select" onChange={handleChange}>
          {clientes.map((cliente, index) => (
            <option key={index} value={cliente.CuentaNIS}>
              {cliente.CuentaSrv === "ENER" ? "⚡" : "📺"}{" "}
              {cliente.CuentaNIS} — {cliente.CuentaDom}
            </option>
          ))}
        </select>
      </div>

      {facts.length > 0 && <ListInvoice facturas={facts} cliente={client} settings={settings} />}

      {loading ? (
        <div className="loading-dots">
          <span />
          <span />
          <span />
        </div>
      ) : (
        factsPagas.length > 0 && (
          <div className="paid-section anim-fade-in">
            <p className="section-label">Últimas facturas pagas</p>
            {groupFacturasPagas(factsPagas).map((factura, index) => {
              const underlying = factura.pagas ?? [factura];
              const representante = pickComprobantePagas(underlying, settings.puntosVentaImprimibles);
              const pdfHref = `/api/factura/pdf/01${client.PersonaNro.toString().padStart(6, "0")}${client.CuentaNro.toString().padStart(6, "0")}${new Date(representante.CompFec).getFullYear()}${(new Date(representante.CompFec).getMonth() + 1).toString().padStart(2, "0")}${(new Date(representante.CompFec).getDate() + 1).toString().padStart(2, "0")}${String(representante.CompTpo).padStart(2, "0")}${representante.CompLet}${String(representante.CompPtoV).padStart(4, "0")}${String(representante.CompNro).padStart(8, "0")}`;

              return (
                <div
                  key={index}
                  className="paid-card anim-slide-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="paid-info">
                    <span>
                      N° <strong>{`${representante.CompPtoV}-${representante.CompNro}`}</strong>
                    </span>
                    <span>
                      <strong>
                        {factura.CompImp.toLocaleString("es-ar", {
                          style: "currency",
                          currency: "ARS",
                          minimumFractionDigits: 2,
                        })}
                      </strong>
                    </span>
                    <span>
                      Vto.{" "}
                      <strong>
                        {new Date(factura.CompVto).getUTCDate().toString().padStart(2, "0")}/
                        {new Date(factura.CompVto).getUTCMonth() + 1}/
                        {new Date(factura.CompVto).getUTCFullYear()}
                      </strong>
                    </span>
                  </div>
                  <Link
                    href={pdfHref}
                    target="_blank"
                    className="inv-btn inv-btn-pdf"
                    style={{ flexShrink: 0 }}
                  >
                    <DocumentArrowDownIcon style={{ width: 13, height: 13 }} />
                    PDF
                  </Link>
                </div>
              );
            })}
          </div>
        )
      )}
    </>
  );
}
