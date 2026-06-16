"use client";

import Image from "next/image";
import QRCode from "react-qr-code";
import { Factura } from "../lib/definitions";
import { CheckPay } from "../lib/data";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface DialogQrProps {
  openQR: boolean;
  setOpenQR: (open: boolean) => void;
  strQr: string;
  invoice: Factura | null;
}

type Status = "waiting" | "success" | "timeout";

const POLL_INTERVAL_MS = 5000;
const MAX_ATTEMPTS = 60; // 5 minutos
//const MAX_ATTEMPTS = 36; // para testing, 3 minutos

export default function DialogQr({ openQR, setOpenQR, strQr, invoice }: DialogQrProps) {
  const [status, setStatus] = useState<Status>("waiting");
  const [attempts, setAttempts] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!openQR || !invoice) return;

    setStatus("waiting");
    setAttempts(0);

    let count = 0;

    intervalRef.current = setInterval(async () => {
      count += 1;
      setAttempts(count);

      if (count > MAX_ATTEMPTS) {
        stopPolling();
        setStatus("timeout");
        return;
      }

      try {
        const res = await CheckPay(invoice.FacturaID.toString().padStart(20, "0"), "QR");
        if (res?.PagoExitoso) {
          stopPolling();
          setStatus("success");
          // Refresca la lista de facturas y cierra el dialog después de 3s
          setTimeout(() => {
            setOpenQR(false);
            router.refresh();
          }, 3000);
        }
      } catch {
        // si la consulta falla, simplemente reintenta en el próximo tick
      }
    }, POLL_INTERVAL_MS);

    return stopPolling;
  }, [openQR, invoice?.FacturaID]);

  const handleClose = () => {
    stopPolling();
    setOpenQR(false);
  };

  if (!openQR || !invoice) return null;

  const dueDateStr = invoice.FacturaFV
    ? `${new Date(invoice.FacturaFV).getUTCDate().toString().padStart(2, "0")}/${new Date(invoice.FacturaFV).getUTCMonth() + 1}/${new Date(invoice.FacturaFV).getUTCFullYear()}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        style={{ backdropFilter: "blur(4px)" }}
        onClick={status === "waiting" ? undefined : handleClose}
      />

      {/* modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl p-5 w-full mx-3 z-10 anim-fade-up"
        style={{ maxWidth: 360 }}
      >
        {/* cerrar */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Cerrar"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* logos */}
        <div className="flex justify-between items-center mb-4">
          <Image src="/logo.png" alt="CELTA" width={56} height={18} className="object-contain" />
          <Image src="/siro-logo.png" alt="SIRO" width={96} height={32} className="object-contain" />
        </div>

        {/* datos de factura */}
        <p className="text-center text-sm" style={{ color: "var(--c-muted)" }}>
          Factura{" "}
          <strong style={{ color: "var(--c-text)" }}>
            {`${invoice.FacturaID.slice(3, 7)}-${invoice.FacturaID.slice(7, 15)}`}
          </strong>
          {dueDateStr && (
            <span className="ml-2">
              · Vto{" "}
              <strong style={{ color: "var(--c-text)" }}>{dueDateStr}</strong>
            </span>
          )}
        </p>
        <p
          className="text-center font-bold mt-1 mb-4"
          style={{ fontSize: "1.375rem", fontFamily: "var(--font-barlow)", color: "var(--c-text)" }}
        >
          {invoice.FacturaSal.toLocaleString("es-ar", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 2,
          })}
        </p>

        {/* contenido según estado */}
        {status === "success" && (
          <div className="flex flex-col items-center gap-3 py-6 anim-fade-in">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "#dcfce7" }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="font-semibold text-lg" style={{ color: "#15803d" }}>¡Pago registrado!</p>
            <p className="text-sm text-center" style={{ color: "var(--c-muted)" }}>
              Se verá reflejado en tu cuenta corriente dentro de las 24 hs hábiles.
            </p>
          </div>
        )}

        {status === "timeout" && (
          <div className="flex flex-col items-center gap-3 py-6 anim-fade-in">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ background: "#fef9c3" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a16207" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="font-medium" style={{ color: "var(--c-warn)" }}>Tiempo de espera agotado</p>
            <p className="text-sm text-center" style={{ color: "var(--c-muted)" }}>
              Si realizaste el pago, se verá reflejado en tu cuenta en 24 hs hábiles.
            </p>
            <button
              onClick={handleClose}
              className="mt-1 home-btn"
              style={{ maxWidth: 200, fontSize: "0.875rem", padding: "0.5rem 1rem" }}
            >
              Cerrar
            </button>
          </div>
        )}

        {status === "waiting" && (
          <>
            <QRCode value={strQr} size={200} className="mx-auto block" />

            {/* indicador de polling */}
            <div
              className="mt-4 flex items-center justify-center gap-2 text-sm rounded-lg py-2 px-3"
              style={{ background: "var(--c-green-xlt)", color: "var(--c-muted)" }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: "var(--c-green)", animation: "pulse 1.5s ease-in-out infinite" }}
              />
              Esperando confirmación de pago…
            </div>

            <p className="text-xs text-center mt-3" style={{ color: "#9ca3af" }}>
              Escaneá el código con tu app bancaria. La confirmación es automática.
            </p>
            <p className="text-xs text-center mt-1" style={{ color: "#9ca3af" }}>
              * El pago se verá reflejado en 24 hs hábiles.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
