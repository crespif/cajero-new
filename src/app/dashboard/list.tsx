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
import DialogQr from "./dialogQr";
import Loading from "./loading";
import { toast } from "sonner";

export default function ListInvoice({
  facturas,
  cliente,
}: {
  facturas: Factura[];
  cliente: Cliente;
}) {
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
    const response = await CheckPay(row.FacturaID.toString().padStart(20, "0"), "QR");
    if (response?.PagoExitoso) {
      setLoading(false);
      setOpen(true);
      return;
    }
    const res = await paymentQR(row);
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
            <DialogQr openQR={openQR} setOpenQR={setOpenQR} strQr={strQr} invoice={fact} />
          )}
          <p className="section-label">Facturas adeudadas</p>
          {facturas.map((invoice, index) => {
            const dueDate = new Date(invoice.FacturaFV);
            const now = new Date();
            const daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / 86400000);
            const isOverdue = daysUntilDue < 0;
            const isSoon = !isOverdue && daysUntilDue <= 5;
            const dueDateStr = `${dueDate.getUTCDate().toString().padStart(2, "0")}/${dueDate.getUTCMonth() + 1}/${dueDate.getUTCFullYear()}`;
            const pdfHref = `/api/factura/pdf/01${cliente.PersonaNro.toString().padStart(6, "0")}${cliente.CuentaNro.toString().padStart(6, "0")}${new Date(invoice.FacturaFE).getFullYear()}${(new Date(invoice.FacturaFE).getMonth() + 1).toString().padStart(2, "0")}${new Date(invoice.FacturaFE).getUTCDate().toString().padStart(2, "0")}${invoice.FacturaID}`;

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
                      Factura <strong>{`${invoice.FacturaID.slice(3, 7)}-${invoice.FacturaID.slice(7, 15)}`}</strong>
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
                <div className="md:hidden text-right my-auto">
                  <Link href={pdfHref} target="_blank" className="inv-btn inv-btn-pdf">
                    <DocumentArrowDownIcon />
                    PDF
                  </Link>
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
                    {dueDate.getTime() + 5 * 86400000 > now.getTime() && invoice.FacturaSal < 300000.01 && (
                      <button className="inv-btn inv-btn-cupon" onClick={() => handleLinkClick(invoice)}>
                        <DocumentTextIcon />
                        Cupón
                      </button>
                    )}
                    <div className="hidden md:flex">
                      <Link href={pdfHref} target="_blank" className="inv-btn inv-btn-pdf">
                        <DocumentArrowDownIcon />
                        PDF
                      </Link>
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
