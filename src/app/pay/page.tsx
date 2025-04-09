"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { cookies } from "next/headers"
import { CheckPay } from "../lib/data"

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
        const hash = cookies().get(`h${idcbte}`)?.value ?? "";
        if (!idcbte || !IdResultado || !IdReferenciaOperacion || !hash) {
          throw new Error("Error en el pago o pago cancelado")
        }

        // Aquí realizarías la consulta a tu API para verificar el estado del pago
        // Este es un ejemplo, deberás reemplazarlo con tu lógica real
        const response = await CheckPay(IdResultado, hash);

        if (!response.PagoExitoso) {
          throw new Error("Error al verificar el pago o pago cancelado")
        }

        await fetch(`http://200.45.235.121:3000/factura/pago`, {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "idcbte": `${response.Request.nro_comprobante}`,
            "fecha_pago": `${new Date(response.FechaRegistro)}`,
            "idoperacion": `${response.IdOperacion}`,
            "importe": parseInt(response.Request.Importe),
            "hash": `${hash}`,
          }) 
        });

        // Simulamos un pequeño retraso para mostrar el estado de carga
        setTimeout(() => {
          setStatus("success")
        }, 1500)
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
          {status === "loading" && <Loader2 className="h-16 w-16 text-primary animate-spin" />}
          {status === "success" && (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <div className="space-y-2 mt-4">
                <p>
                  Pago realizado con exito, recuerde que se vera reflejado en su cuenta corriente dentro de las 24 horas.
                </p>
              </div>
            </div>
          )}
          {status === "error" && (
            <div className="text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <p className="mt-4">No pudimos procesar tu pago. Por favor, intenta nuevamente o contacta a soporte.</p>
            </div>
          )}
        </div>
        <div className="flex justify-center gap-4">
          {status === "success" && (
            <button>
              <Link href="/dashboard">Ir a mi cuenta</Link>
            </button>
          )}
          {status === "error" && (
            <button>
              <Link href="/checkout">Intentar nuevamente</Link>
            </button>
          )}
          <button>
            <Link href="/">Volver al inicio</Link>
          </button>
        </div>
      </div>
    </div>
  )
}
