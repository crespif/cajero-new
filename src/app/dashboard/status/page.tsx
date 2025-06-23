"use client"


import { useSearchParams } from "next/navigation"
import CheckPayFront from "./check";


export default function Status(){

  const params = useSearchParams();
  const idResultado = params?.get('IdResultado') || '';
  const idReferenciaOperacion = params?.get('IdReferenciaOperacion') || '';



  return (
    <CheckPayFront idResultado={idResultado} IdReferenciaOperacion={idReferenciaOperacion} />
  )

}