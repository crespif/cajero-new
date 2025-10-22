"use client";

import { Cliente, Factura, FacturaPagas } from "../lib/definitions";
import { useEffect, useState } from "react";
import ListInvoice from "./list";
import {
  DocumentArrowDownIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function SelectSumin({
  clientes,
  facturas,
}: {
  clientes: Cliente[];
  facturas: Factura[];
}) {
  const [client, setClient] = useState(clientes[0]);
  const monthExclude = [12]; // Exclude Month by default
  /* Filtracion de facturas iniciales */
  const [facts, setFacts] = useState(
    facturas.filter(
      (factura) =>
        factura.CuentaNIS === client.CuentaNIS &&
        !monthExclude.includes(new Date(factura.FacturaFV).getMonth() + 1)
    )
  );
  
  const [factsPagas, setFactsPagas] = useState<FacturaPagas[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchPagas = async () => {
      try {
        const response = await fetch(
          `/api/factura/pagas?cta=${client.PersonaNro}&sum=${client.CuentaNro}`
        );
        const data = await response.json();
        /* Ordenar facturas pagas por CompFec desc */
        data.sort((a: FacturaPagas, b: FacturaPagas) => {
          return new Date(b.CompVto).getTime() - new Date(a.CompVto).getTime();
        });
        setFactsPagas(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pagas:", error);
      }
    };
    fetchPagas();
  }, [client.PersonaNro, client.CuentaNro]);

  const handleChange = (e: any) => {
    const selected = clientes.filter(
      (cliente) => cliente.CuentaNIS === e.target.value
    );
    /* Filtracion de facturas -- VER MES MAYO */
    setFacts(
      facturas.filter(
        (factura) =>
          factura.CuentaNIS === selected[0].CuentaNIS &&
          !monthExclude.includes(new Date(factura.FacturaFV).getMonth() + 1)
      )
    );
    //setFacts(facturas.filter(factura => factura.CuentaNIS === selected[0].CuentaNIS));
    setClient(selected[0]);
  };

  return (
    <>
      <div className="sticky top-0 backdrop-opacity-95 bg-white/95 mx-1 p-2 rounded drop-shadow">
        <h1 className="text-center mb-2 text-sm">
          Suministros del cliente:{" "}
          <strong>{`${client.CuentaDoc} - ${client.CuentaNom}`} </strong>
        </h1>
        <div className="relative">
          <select
            className="peer block w-full rounded-md border border-gray-200 py-1 pl-1 text-sm outline-2 placeholder:text-gray-500"
            onChange={handleChange}
          >
            {clientes.map((cliente, index) => (
              <option key={index} value={cliente.CuentaNIS} className="">
                {cliente.CuentaSrv === "ENER" ? "💡" : "📺"}
                {cliente.CuentaNIS} - {cliente.CuentaDom}
              </option>
            ))}
          </select>
        </div>
      </div>
    
      { facts.length > 0 && <ListInvoice facturas={facts} cliente={client} />}
 
      {
        loading && (
          <div className="flex justify-center items-center mt-5">
            <span className="text-gray-500">Cargando facturas pagas...</span>
          </div>
        )
      }
      {factsPagas.length > 0 && (
        <div className="mt-5">
          <h2 className="text-center mb-2 text-sm">Últimas facturas pagas</h2>
          <ul className="list-disc pl-5">
            {factsPagas.map((factura, index) => (
              <div key={index} className="flex flex-row p-2 gap-2 items-center">
                <DocumentTextIcon className="md:w-6 md:h-6 text-gray-500 w-16 h-16" />
                <div className="flex md:flex-row flex-col md:gap-2 gap-1 my-auto w-8/12 text-xs">
                  <span className=" text-gray-600 md:text-center">
                    {/* {`${(invoice.FacturaID).slice(0, 2)}-${(invoice.FacturaID).slice(2,3)}-${(invoice.FacturaID).slice(3,7)}-${(invoice.FacturaID).slice(7,15)}`} */}
                    Factura N°:{" "}
                    <strong>{`${factura.CompPtoV}-${factura.CompNro}`}</strong>
                  </span>
                  <span className=" text-gray-600 md:text-center">
                    Importe:{" "}
                    <strong>
                      {factura.CompImp.toLocaleString("es-ar", {
                        style: "currency",
                        currency: "ARS",
                        minimumFractionDigits: 2,
                      })}
                    </strong>
                  </span>
                  <span className=" text-gray-600 md:text-center">
                    Vencimiento:{" "}
                    <strong>
                      {new Date(factura.CompVto).toLocaleDateString("es-ar")}
                    </strong>
                  </span>
                </div>
                <Link
                  href={`/api/factura/pdf/01${client.PersonaNro.toString().padStart(
                    6,
                    "0"
                  )}${client.CuentaNro.toString().padStart(6, "0")}${new Date(
                    factura.CompFec
                  ).getFullYear()}${(new Date(factura.CompFec).getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}${(
                    new Date(factura.CompFec).getDate() + 1
                  )
                    .toString()
                    .padStart(2, "0")}${String(factura.CompTpo).padStart(
                    2,
                    "0"
                  )}${factura.CompLet}${String(factura.CompPtoV).padStart(
                    4,
                    "0"
                  )}${String(factura.CompNro).padStart(8, "0")}`}
                  target="_blank"
                  className="bg-green-800 text-white rounded-md  text-xs flex items-center p-1 w-32  hover:bg-green-600"
                  onClick={() => {
                    console.log(
                      `/api/factura/pdf/01${client.PersonaNro.toString().padStart(
                    6,
                    "0"
                  )}${client.CuentaNro.toString().padStart(6, "0")}${new Date(
                    factura.CompFec
                  ).getFullYear()}${(new Date(factura.CompFec).getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}${(
                    new Date(factura.CompFec).getDate() + 1
                  )
                    .toString()
                    .padStart(2, "0")}${String(factura.CompTpo).padStart(
                    2,
                    "0"
                  )}${factura.CompLet}${String(factura.CompPtoV).padStart(
                    4,
                    "0"
                  )}${String(factura.CompNro).padStart(8, "0")}`
                    )
                  }}
                >
                  <DocumentArrowDownIcon className="w-6 h-6 text-white mr-1 " />
                  Ver
                </Link>
              </div>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
