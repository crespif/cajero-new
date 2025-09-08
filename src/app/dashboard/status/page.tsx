"use client"


import { useSearchParams } from "next/navigation"
import CheckPayFront from "./check";


export default function Status(){

  const params = useSearchParams();
  const idReferenciaOperacion = params?.get('IdReferenciaOperacion') || '';



  return (
    <CheckPayFront IdReferenciaOperacion={idReferenciaOperacion} />
  )

}