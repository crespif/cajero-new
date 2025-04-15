"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckPay } from "../lib/data"
import Loading from "./loading"

export default function PaymentStatus() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Extraer los parámetros de la URL
        const idcbte = searchParams.get("idcbte")
        const IdResultado = searchParams.get("IdResultado")
        const IdReferenciaOperacion = searchParams.get("IdReferenciaOperacion")
        
        if (!idcbte || !IdResultado || !IdReferenciaOperacion) {
          throw new Error("Error en el pago o pago cancelado")
        }
        // Aquí realizarías la consulta a tu API para verificar el estado del pago
        // Este es un ejemplo, deberás reemplazarlo con tu lógica real
        const response = await CheckPay(IdResultado, idcbte);
   
        if (!response.PagoExitoso) {
          throw new Error("Error al verificar el pago o pago cancelado")
        }
        setStatus("success")
      } catch (error) {
        console.error("Error verificando el pago:", error)
        setStatus("error")
      }
    }

    checkPaymentStatus()
  }, [searchParams])

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">
            {status === "loading" && "Verificando pago..."}
            {status === "success" && "¡Pago exitoso!"}
            {status === "error" && "Error en el pago"}
          </div>
          <div className="text-center">
            {status === "loading" && "Estamos procesando tu información..."}
            {status === "success" && "Tu transacción se ha completado correctamente"}
            {status === "error" && "Ha ocurrido un problema con tu pago"}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-6">
          {status === "loading" && <Loading />}
          {status === "success" && (
            <div className="flex flex-col items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="green" 
                  stroke="currentColor" 
                  stroke-width="2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                  className="w-10 h-10">
                <path d="M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>

              <div className="space-y-2 mt-4">
                <p className="text-center">
                  Pago realizado con exito, recuerde que se vera reflejado en su cuenta corriente dentro de las 24 horas.
                </p>
              </div>
            </div>
          )}
          {status === "error" && (
            <div className="flex flex-col justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="yellow"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
              <p className="mt-4 text-center">Error en el pago / pago cancelado.</p>
              <p className="mt-2 text-center">Por favor, intenta nuevamente.</p>
            </div>
          )}
        </div>
        <div className="flex justify-center gap-4">
          <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded">
            <Link href="/">Volver al inicio</Link>
          </button>
        </div>
      </div>
    </div>
  )
}
