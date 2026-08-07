"use client";

import { useRouter } from "next/navigation";
import { Cliente, Factura } from "../lib/definitions";
import { CreditCardIcon } from "@heroicons/react/24/solid";
import {
  DocumentTextIcon,
  DocumentArrowDownIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import Dialog from "../ui/dialog";
import { useState } from "react";
import Link from "next/link";
import { CheckPay, paymentQR } from "../lib/data";
import { buildComprobante, pickComprobante } from "../lib/comprobante";
import type { AppSettings } from "../lib/settings";
import DialogQr from "./dialogQr";
import Loading from "./loading";
import { toast } from "sonner";

function groupFacturas(facturas: Factura[]): Factura[] {
  const groups = new Map<string, Factura[]>();
  for (const f of facturas) {
    const key = [f.FacturaFE, f.FacturaPer, f.FacturaFV, f.FacturaDA, f.PersonaNro, f.CuentaNro, f.CuentaNIS, f.CuentaUnA].join("|");
    const group = groups.get(key);
    if (group) group.push(f);
    else groups.set(key, [f]);
  }
  return Array.from(groups.values()).map((group) => {
    if (group.length === 1) return group[0];
    return {
      ...group[0],
      FacturaID: group.map((f) => f.FacturaID).join(","),
      FacturaImp: group.reduce((sum, f) => sum + f.FacturaImp, 0),
      FacturaSal: group.reduce((sum, f) => sum + f.FacturaSal, 0),
      facturas: group,
    };
  });
}

export default function ListInvoice({
  facturas: rawFacturas,
  cliente,
  settings,
}: {
  facturas: Factura[];
  cliente: Cliente;
  settings: AppSettings;
}) {
  const facturas = groupFacturas(rawFacturas);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [openQR, setOpenQR] = useState(false);
  const [strQr, setstrQr] = useState("");
  const [fact, setFact] = useState<Factura | null>(null);

  const handlePayLoad = (invoice: Factura) => async () => {
    setLoading(true);
    const query = await fetch(`/api/factura/pago/${invoice.FacturaID}`);
    const data = await query.json();
    if (!data.error) {
      setLoading(false);
      setOpen(true);
    } else {
      router.push(`/pay/${invoice.FacturaID}?doc=${cliente.CuentaDoc}`);
    }
  };

  const handleLinkClick = (invoice: Factura) => {
    const facturaBase64 = btoa(JSON.stringify(invoice));
    router.push(`/dashboard/factura?cupon=${encodeURIComponent(facturaBase64)}`);
  };

  const handleQr = async (row: Factura) => {
    setLoading(true);
    const query = await fetch(`/api/factura/pago/${row.FacturaID}`);
    const data = await query.json();
    if (!data.error) {
      setLoading(false);
      setOpen(true);
      return;
    }
    const underlying = row.facturas ?? [row];
    const comprobante = buildComprobante(pickComprobante(underlying, settings.puntosVentaImprimibles));
    const response = await CheckPay(comprobante, "QR");
    if (response?.PagoExitoso) {
      setLoading(false);
      setOpen(true);
      return;
    }
    const res = await paymentQR(underlying);
    if (res && res.StringQR) {
      setLoading(false);
      setstrQr(res.StringQR);
      setOpenQR(true);
      setFact(row);
    } else {
      setLoading(false);
      toast("Se ha producido un error al generar el QR.", {
        description: "Por favor, intente nuevamente más tarde.",
        action: { label: "Cerrar", onClick: () => setOpenQR(false) },
      });
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="invoices-section">
      <Dialog open={open} setOpen={setOpen} />

      {facturas.length === 0 ? (
        <div className="empty-state anim-fade-in">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Sin facturas adeudadas
        </div>
      ) : (
        <>
          {fact && openQR && (
            <DialogQr
              openQR={openQR}
              setOpenQR={setOpenQR}
              strQr={strQr}
              invoice={fact}
              puntosVentaImprimibles={settings.puntosVentaImprimibles}
            />
          )}
          <p className="section-label">Facturas adeudadas</p>
          {facturas.map((invoice, index) => {
            const dueDate = new Date(invoice.FacturaFV);
            const now = new Date();
            const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / 86400000);
            const isOverdue = daysUntilDue < 0;
            const isSoon = !isOverdue && daysUntilDue <= 5;
            const dueDateStr = `${dueDate.getUTCDate().toString().padStart(2, "0")}/${dueDate.getUTCMonth() + 1}/${dueDate.getUTCFullYear()}`;
            const underlying = invoice.facturas ?? [invoice];
            const representante = pickComprobante(underlying, settings.puntosVentaImprimibles);
            const invoiceLabel = `${representante.FacturaID.slice(3, 7)}-${representante.FacturaID.slice(7, 15)}`;
            const pdfHrefs = [`/api/factura/pdf/01${cliente.PersonaNro.toString().padStart(6, "0")}${cliente.CuentaNro.toString().padStart(6, "0")}${new Date(representante.FacturaFE).getFullYear()}${(new Date(representante.FacturaFE).getMonth() + 1).toString().padStart(2, "0")}${new Date(representante.FacturaFE).getUTCDate().toString().padStart(2, "0")}${representante.FacturaID}`];

            return (
              <div
                key={index}
                className="inv-card anim-fade-up md:flex-col lg:flex-row"
                style={{ animationDelay: `${index * 0.07}s` }}
              >
                <div className="flex gap-2 flex-1">
                  {/* ícono */}
                  <div className="inv-icon">
                    <DocumentTextIcon className="w-[20px] h-[20px]" />
                  </div>

                  {/* datos: N°, importe, vencimiento */}
                  <div className="inv-data justify-between">
                    {invoice.FacturaDA === "S" && (
                      <span className="inv-da-badge">⚡ Débito automático</span>
                    )}
                    <span className="inv-num">
                      Factura <strong>{invoiceLabel}</strong>
                    </span>
                    <span className="inv-amount">
                      {invoice.FacturaSal.toLocaleString("es-ar", {
                        style: "currency",
                        currency: "ARS",
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    <span className={`inv-due${isOverdue ? " overdue" : isSoon ? " soon" : ""}`}>
                      {isOverdue
                        ? `⚠ Vencida · ${dueDateStr}`
                        : isSoon
                          ? `⏰ Vence en ${daysUntilDue}d · ${dueDateStr}`
                          : `Vence ${dueDateStr}`}
                    </span>
                  </div>
                  
                </div>
                <div className="md:hidden text-right my-auto flex flex-col gap-1 items-end">
                  {pdfHrefs.map((href, i) => (
                    <Link key={i} href={href} target="_blank" className="inv-btn inv-btn-pdf">
                      <DocumentArrowDownIcon />
                      PDF{pdfHrefs.length > 1 ? ` ${i + 1}` : ""}
                    </Link>
                  ))}
                </div>

                {/* acciones */}
                {invoice.FacturaSal > 0 && (
                  <div className="inv-actions justify-center anim-fade-in" style={{ animationDelay: `${index * 0.07 + 0.1}s` }}>
                    {invoice.FacturaSal < 3000000.01 && (
                      <button className="inv-btn inv-btn-pay" onClick={handlePayLoad(invoice)}>
                        <CreditCardIcon />
                        Pagar
                      </button>
                    )}
                    <button className="inv-btn inv-btn-qr" onClick={() => handleQr(invoice)}>
                      <QrCodeIcon />
                      QR
                    </button>
                    {settings.mostrarCuponPago &&
                      dueDate.getTime() + 5 * 86400000 > now.getTime() &&
                      invoice.FacturaSal < 300000.01 && (
                        <button className="inv-btn inv-btn-cupon" onClick={() => handleLinkClick(invoice)}>
                          <DocumentTextIcon />
                          Cupón
                        </button>
                      )}
                    <div className="hidden md:flex gap-1">
                      {pdfHrefs.map((href, i) => (
                        <Link key={i} href={href} target="_blank" className="inv-btn inv-btn-pdf">
                          <DocumentArrowDownIcon />
                          PDF{pdfHrefs.length > 1 ? ` ${i + 1}` : ""}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
