"use client";

import { useRouter } from "next/navigation";
import { Cliente, Factura } from "../lib/definitions";
import { DocumentTextIcon, CreditCardIcon } from "@heroicons/react/24/solid";
import Dialog from "../ui/dialog";
import { useState } from "react";
import Link from "next/link";
import { DocumentArrowDownIcon, QrCodeIcon } from "@heroicons/react/24/outline";
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
    // encriptar el icbte de invoice
    //router.push(`/pay/${invoice.FacturaID}`, { state: { fac: invoice }});
    /*
    const queryParams = new URLSearchParams({
      fc: JSON.stringify(invoice),
    }).toString();
    router.push(`/pay/${invoice.FacturaID}?${queryParams}`); */

    /* Se verifica si ya hay un pago por esta factura en el día */
    setLoading(true);
    const query = await fetch(`/api/factura/pago/${invoice.FacturaID}`);
    const data = await query.json();
    if (!data.error) {
      setLoading(false);
      setOpen(true);
      return;
    } else {
      router.push(`/pay/${invoice.FacturaID}?doc=${cliente.CuentaDoc}`);
    }
  };

  const handleLinkClick = (invoice: any) => {
    /* codificador */
    const facturaString = JSON.stringify(invoice);
    const facturaBase64 = btoa(facturaString);
    const facturaEncoded = encodeURIComponent(facturaBase64);
    router.push(`/dashboard/factura?cupon=${facturaEncoded}`);
  };

  const handleQr = async (row: Factura) => {
    setLoading(true);
    // Verificar si ya hay un pago por esta factura en el día
  
    const response = await CheckPay((row.FacturaID).toString().padStart(20,'0'), 'QR');
    if (response?.PagoExitoso) {
      setLoading(false);
      setOpen(true);
      return;
    } else {
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
          action: {
            label: "Cerrar",
            onClick: () => setOpenQR(false),
          },
        });
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="mt-5 overflow-auto">
      <Dialog open={open} setOpen={setOpen} />
      <h2 className="text-center mb-2">Listado de facturas adeudadas</h2>
      {facturas.length === 0 && (
        <div className="flex items-center justify-center gap-2 bg-green-200 p-2 rounded-md">
          <svg
            className="w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <p className="text-center text-gray-800">
            No se encontraron facturas adeudadas
          </p>
        </div>
      )}
      <div className="">
        {facturas.map((invoice: Factura, index: any) => (
          <div key={index} className="border border-gray-200 rounded-md">
            {invoice.FacturaDA == "S" && (
              <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                Factura en Debito Automatico
              </span>
            )}
            <div className="flex flex-row p-2 gap-2 mb-2 items-center">
              <DocumentTextIcon className="md:w-6 md:h-6 text-gray-500 w-16 h-16" />
              <div className="flex md:flex-row flex-col md:gap-2 gap-1 my-auto w-8/12 text-xs">
                <span className=" text-gray-600 md:text-center">
                  {/* {`${(invoice.FacturaID).slice(0, 2)}-${(invoice.FacturaID).slice(2,3)}-${(invoice.FacturaID).slice(3,7)}-${(invoice.FacturaID).slice(7,15)}`} */}
                  Factura N°:{" "}
                  <strong>{`${invoice.FacturaID.slice(
                    3,
                    7
                  )}-${invoice.FacturaID.slice(7, 15)}`}</strong>
                </span>
                <span className=" text-gray-600 md:text-center">
                  Importe:{" "}
                  <strong>
                    {invoice.FacturaSal.toLocaleString("es-ar", {
                      style: "currency",
                      currency: "ARS",
                      minimumFractionDigits: 2,
                    })}
                  </strong>
                </span>
                <span className=" text-gray-600 md:text-center">
                  Vencimiento:{" "}
                  <strong>
                    {new Date(invoice.FacturaFV).toLocaleDateString("es-ar")}
                  </strong>
                </span>
              </div>
              <div className="flex md:flex-row flex-col md:gap-2 gap-1 my-auto w-6/12 justify-end">
                {/* {invoice.FacturaDA == "N" && invoice.FacturaSal > 0 && ( */}
                {invoice.FacturaSal > 0 && (
                  <>
                    {invoice.FacturaSal < 2000000.01 && (
                      <button
                        className="bg-blue-800 text-white rounded-md  text-xs flex items-center w-32 p-1  hover:bg-blue-600"
                        onClick={handlePayLoad(invoice)}
                      >
                        <CreditCardIcon className="w-6 h-6 text-white mr-1 " />
                        Pagar
                      </button>
                    )}
                    {
                      <button
                        className="text-white rounded-md  text-xs flex items-center w-32 p-1 bg-purple-800 hover:bg-purple-600"
                        onClick={() => handleQr(invoice)}
                      >
                        <QrCodeIcon className="w-6 h-6 text-white mr-1 " />
                        PAGO QR
                      </button>
                    }
                    {fact && openQR && invoice.FacturaSal < 2000000.01 && (
                      <DialogQr
                        openQR={openQR}
                        setOpenQR={setOpenQR}
                        strQr={strQr}
                        invoice={fact}
                      />
                    )}
                    {
                      // TODO hay un problema con el cupon de pago, no se puede generar el codigo de barras porque para generar el digito verificador se necesita el ID como numero
                      invoice.FacturaSal < 300000.01 && (
                        <button
                          className="bg-orange-800 text-white rounded-md  text-xs flex items-center w-32 p-1 hover:bg-orange-600"
                          onClick={() => handleLinkClick(invoice)}
                        >
                          <DocumentTextIcon className="w-6 h-6 text-white mr-1 " />
                          Ver Cupón
                        </button>
                      )
                    }
                  </>
                )}

                <Link
                  href={`/api/factura/pdf/01${cliente.PersonaNro.toString().padStart(
                    6,
                    "0"
                  )}${cliente.CuentaNro.toString().padStart(6, "0")}${new Date(
                    invoice.FacturaFE
                  ).getFullYear()}${(new Date(invoice.FacturaFE).getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}${(
                    new Date(invoice.FacturaFE).getDate() + 1
                  )
                    .toString()
                    .padStart(2, "0")}${invoice.FacturaID}`}
                  target="_blank"
                  className="bg-green-800 text-white rounded-md  text-xs flex items-center p-1 w-32  hover:bg-green-600"
                >
                  <DocumentArrowDownIcon className="w-6 h-6 text-white mr-1 " />
                  Ver
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
