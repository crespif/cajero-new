'use client'

import { Cliente, Factura } from "../lib/definitions";
import {useState} from 'react';
import { Suspense } from 'react';
import { ListSkeleton } from "../ui/skeletons";
import ListInvoice from "./list";

export default function SelectSumin({ clientes, facturas }: { clientes: Cliente[]; facturas: Factura[] }) {

  const [client, setClient] = useState(clientes[0]);
  /* Filtracion de facturas iniciales -- VER MES MAYO */
  //const [facts, setFacts] = useState(facturas.filter(factura => factura.CuentaNIS === client.CuentaNIS && ![5, 6].includes(new Date(factura.FacturaFV).getMonth() + 1)));
  const [facts, setFacts] = useState(facturas.filter(factura => factura.CuentaNIS === client.CuentaNIS));

  const handleChange = (e: any) => {
    const selected = clientes.filter(cliente => cliente.CuentaNIS === e.target.value)
    /* Filtracion de facturas -- VER MES MAYO */
    //setFacts(facturas.filter(factura => factura.CuentaNIS === selected[0].CuentaNIS && ![5, 6].includes(new Date(factura.FacturaFV).getMonth() + 1)));
    setFacts(facturas.filter(factura => factura.CuentaNIS === selected[0].CuentaNIS));
    setClient(selected[0]);
  }

  return (
    <>
      <div className="sticky top-0 backdrop-opacity-95 bg-white/95 mx-1 p-2 rounded drop-shadow">
        <h1 className="text-center mb-2 text-sm">Suministros del cliente: <strong>{`${client.CuentaDoc} - ${client.CuentaNom}`}  </strong></h1>
        <div className="relative">
          <select className="peer block w-full rounded-md border border-gray-200 py-1 pl-1 text-sm outline-2 placeholder:text-gray-500" onChange={handleChange}>
            {clientes.map((cliente, index) => (
              <option key={index} value={cliente.CuentaNIS} className="">
                {cliente.CuentaSrv === 'ENER' ? '💡' : '📺'}
                {cliente.CuentaNIS} - {cliente.CuentaDom}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Suspense fallback={<ListSkeleton />}>
        <ListInvoice facturas={facts} doc={client.CuentaDoc} />
      </Suspense>
    </>
  )    
}