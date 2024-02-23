'use client'
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/")
  })

  return (
    <div className="flex">
      <h1>404 | Page not found</h1>.
    </div>
  )
}