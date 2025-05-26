"use client";

const { useState } = require("react");

import MediosDePago from "@/app/ui/mediosdepago";
import JsBarcode from "jsbarcode";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Factura() {
  const searchParams = useSearchParams();
  const [vto, setVto] = useState(null);
  const router = useRouter();

  const factura = searchParams.get("cupon");

  useEffect(() => {
    const vencimiento = new Date();
    vencimiento.setDate(vencimiento.getDate() + 2);
    setVto(vencimiento.toLocaleDateString());
  }, []);

  /* decodificador */
  const facturaDecoded = decodeURIComponent(factura ?? "");
  const facturaBase64 = atob(facturaDecoded);
  const fact = JSON.parse(facturaBase64);

  function barcode() {
    const letraCbte = (fact.FacturaID).slice(2, 3) == "A" ? "1" : "2";
    const nroCbte = `${(fact.FacturaID).slice(0, 2)}${letraCbte}${(fact.FacturaID).slice(3,7)}${(fact.FacturaID).slice(7,15)}`;
    /* let cliente = (fact.FacturaID).padStart(15, '0'); */
    let fecha = new Date();
    fecha.setDate(fecha.getDate() + 2);
    //setVto(fecha);
    let strFecha = fecha.toISOString().slice(0, 10).replace(/-/g, "");
    strFecha = strFecha.substring(2, strFecha.length);
    let importe = (fact.FacturaSal)
      .toFixed(2)
      .replace(/\./g, "")
      .padStart(10, "0");
    let string = `0448${nroCbte}${strFecha}${importe}0000000000005120185697`;
    //let string = `044711234567800000000000000000000000000000001234567890`;
    let digitoVerificador1 = digitoVerificacion(string);
    string += `${digitoVerificador1}`;
    let digitoVerificador2 = digitoVerificacion(string);
    string += `${digitoVerificador2}`;
    //setCodigoBarra(string);
    const img = new Image();
    if (img) {
      //JsBarcode(".barcode", string.replace(".", ""), { format: "itf" });
      JsBarcode(".barcode", string.replace(".", ""));
    }
  }

  function digitoVerificacion(s: any) {
    let secuencia = [3, 5, 7, 9];
    let x = 0; //indice de secuencia
    let suma = 0;
    suma += s[0] * 1;
    for (let i = 1; i < s.length; i++) {
      suma += s[i] * secuencia[x];
      secuencia[x] == 9 ? (x = 0) : x++;
    }
    return parseInt(((suma / 2) % 10).toString());
  }

  return (
    <>
      <div className="w-full md:w-2/3">
        <div className="flex justify-between mb-2">
          <button
            onClick={() => window.print()}
            className="text-xs md:text-lg flex items-center print:hidden border-2 rounded-md p-1 hover:bg-gray-200 m-auto"
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
                d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
              />
            </svg>
            Imprimir
          </button>
          <div
            className="cursor-pointer print:hidden border-2 rounded-md p-1 hover:bg-gray-200 mr-1"
            onClick={() => router.back()}
          >
            <span className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className="bg-white border-dashed border-2 border-black-600 p-2 print:mt-4 mb-4">
          <div className="flex items-center mb-2">
            <div className="flex-shrink-0">
              <img src="/logo.png" className="h-15 w-14" />
            </div>
            <div className="w-full text-center">
              <h1 className="text-lg">Cupón de pago</h1>
            </div>
            <div className="flex-shrink-0">
              <img src="/siro-logo.png" className="h-15 w-28" />
            </div>
          </div>

          <div className="mb-2">
            <p className="text-xs md:text-sm">
              <span className="font-semibold">Suministro: </span>{" "}
              {fact.CuentaNro} - {fact.CuentaNIS}
            </p>
            {/* <p className="text-xs md:text-sm">
              <span className="font-semibold">Domicilio: </span>{" "}
              {fact.}
            </p> */}
          </div>

          <div className="w-full flex text-center justify-around">
            <p className="text-xs md:text-sm">
              <span className="font-semibold">Factura:</span> {(fact.FacturaID).slice(3,7)}{" "}
              - {(fact.FacturaID).slice(2,3)} - {(fact.FacturaID).slice(7,15)}
            </p>
            <p className="text-xs md:text-sm">
              <span className="font-semibold">Importe:</span>{" "}
              {fact.FacturaSal.toLocaleString("es-ar", {
                style: "currency",
                currency: "ARS",
                minimumFractionDigits: 2,
              })}{" "}
            </p>
          </div>

          <div className="flex-shrink-0">
            <svg className="barcode w-full h-full" ref={barcode}></svg>
          </div>
          <p className="text-xs">
            *IMPORTANTE: Este Cupón de pago vence el día {vto}. Con
            posterioridad a esa fecha, deberás imprimir un nuevo comprobante
          </p>
        </div>

        <div className="print:hidden text-center text-xs">
          <MediosDePago />
        </div>
      </div>
    </>
  );
}
