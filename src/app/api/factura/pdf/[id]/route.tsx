// app/api/facturapdf/[id]/route.ts
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  const pdfUrl = `http://200.45.235.121:3000/facturapdf/${id}`

  try {
    const response = await fetch(pdfUrl)

    if (!response.ok) {
      return new Response('Error al obtener el PDF', { status: response.status })
    }

    const buffer = await response.arrayBuffer()

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
      },
    })
  } catch (error) {
    return new Response('Error interno al obtener el PDF', { status: 500 })
  }
}
