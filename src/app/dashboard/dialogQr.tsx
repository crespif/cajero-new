"use client";

import Image from "next/image";
import QRCode from "react-qr-code";
import { Factura } from "../lib/definitions";
import Link from "next/link";

interface DialogQrProps {
  openQR: boolean;
  setOpenQR: (open: boolean) => void;
  strQr: string;
  invoice: Factura | null;
}

export default function DialogQr({ openQR, setOpenQR, strQr, invoice }: DialogQrProps) {
  return (
    openQR && invoice && (
      <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-200 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          {/* Boton para cerrar el modal */}
          <button
            onClick={() => setOpenQR(false)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex justify-between items-center mb-4 mt-2">
            <Image
              src="/logo.png" // Ruta en /public
              alt="Banco Roela"
              width={70}
              height={20}
              className="object-contain"
            />
            <Image
              src="/siro-logo.png" // Ruta en /public
              alt="Plataforma de Pago"
              width={120}
              height={40}
              className="object-contain"
            />
          </div>
          {/* <h2 className="text-xl font-bold mb-4 text-center">Código QR para pagar</h2> */}
          <p className="text-center">
            Factura N°:{" "}
            <strong>{`${(invoice.FacturaID).slice(3,7)}-${(invoice.FacturaID).slice(7,15)}`}</strong>
            {invoice.FacturaFV && (
              <span className="ml-2">
                Vto:{" "}
                <strong>
                  {new Date(invoice.FacturaFV).toLocaleDateString("es-ar")}
                </strong>
              </span>
            )}
          </p>
          <span className="text-xl font-bold text-center block mb-4">
            {invoice.FacturaSal.toLocaleString("es-ar", {
              style: "currency",
              currency: "ARS",
              minimumFractionDigits: 2,
            })}
          </span>

          <QRCode value={strQr} size={200} className="mx-auto" />
          <p className="mt-4 text-center mb-4 text-gray-500 text-sm">
            * Este código QR con tu aplicación bancaria para realizar el
            pago.
          </p>
          <p className="text-sm text-gray-600 text-center flex flex-col">
            <span className="font-bold">** EVITE CORTES DE SERVICIO ** </span>
            {`Una vez realizado el pago, presiona el botón "Pago realizado", para informar a CELTA sobre el mismo.`}
            <span className="mt-1">{`*Recuerde que el pago, igualmente, se verá reflejado en su cuenta corriente dentro de las 24 horas hábiles.`}</span>
          </p>
          <div>
            <Link
              href={`/pay?idcbte=${invoice.FacturaID}&type=QR`}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 block text-center"
            >
              Pago realizado
            </Link>
          </div>
        </div>
      </div>
    )
  );
}
