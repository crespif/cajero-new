'use client'
import { TvIcon } from "@heroicons/react/16/solid";
import { BoltIcon } from "@heroicons/react/20/solid";
import { Cliente } from "../lib/definitions";
import {useState} from 'react';
import { Suspense } from 'react';
import { ListSkeleton } from "../ui/skeletons";
import ListInvoice from "./list";
import Link from "next/link";

export default function SelectSumin({ clientes }: { clientes: Cliente[] }) {

  const [client, setClient] = useState(clientes[0]);

  const handleChange = (e: any) => {
    const selected = clientes.filter(cliente => cliente.idsuministro === Number(e.target.value));
    setClient(selected[0]);
  }

  return (
    <>
      <div className="sticky top-0 backdrop-opacity-95 bg-white/95 mx-1 p-2 rounded drop-shadow">
        <h1 className="text-center mb-2 text-sm">Suministros del cliente: <strong>{`${client.nrodocumento} - ${client.razon_social}`}  </strong></h1>
        <div className="relative">
          <select className="peer block w-full rounded-md border border-gray-200 py-1 pl-1 text-sm outline-2 placeholder:text-gray-500" onChange={handleChange}>
            {clientes.map((cliente, index) => (
              <option key={index} value={cliente.idsuministro} className="">
                {cliente.servicio === 'ENERGIA' ? '💡' : '📺'}
                {cliente.cod_suministro} - {cliente.domicilio}
              </option>
            ))}
          </select>
         {/*  {
            client.servicio == "ENERGIA" ?
              <BoltIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-yellow-300" />
              :
              <TvIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          } */}
        </div>
      </div>
     {/*  <Suspense fallback={<ListSkeleton />}>
        <ListInvoice client={client} />
      </Suspense> */}
    </>
  )    
}