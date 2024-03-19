'use client'
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/")
  })

  return (
    <div className="flex flex-col">
      <h1>404 | Pagina no encontrada</h1>.
      <div className="text-center">
        <Link href="/" className="border rounded-lg bg-blue-400 text-center text-white p-2 hover:bg-blue-700">
          Ir al inicio
        </Link>
      </div>
    </div>
  )
}