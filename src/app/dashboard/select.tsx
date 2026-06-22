"use client";

import { Cliente, Factura, FacturaPagas } from "../lib/definitions";
import { useEffect, useState } from "react";
import ListInvoice from "./list";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function SelectSumin({
  clientes,
  facturas,
}: {
  clientes: Cliente[];
  facturas: Factura[];
}) {
  const [client, setClient] = useState(clientes[0]);
  const monthExclude = [8];

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

      {facts.length > 0 && <ListInvoice facturas={facts} cliente={client} />}

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
            {factsPagas.map((factura, index) => {
              const pdfHref = `/api/factura/pdf/01${client.PersonaNro.toString().padStart(6, "0")}${client.CuentaNro.toString().padStart(6, "0")}${new Date(factura.CompFec).getFullYear()}${(new Date(factura.CompFec).getMonth() + 1).toString().padStart(2, "0")}${(new Date(factura.CompFec).getDate() + 1).toString().padStart(2, "0")}${String(factura.CompTpo).padStart(2, "0")}${factura.CompLet}${String(factura.CompPtoV).padStart(4, "0")}${String(factura.CompNro).padStart(8, "0")}`;

              return (
                <div
                  key={index}
                  className="paid-card anim-slide-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="paid-info">
                    <span>
                      N° <strong>{`${factura.CompPtoV}-${factura.CompNro}`}</strong>
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
