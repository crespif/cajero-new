// app/api/payment-qr/route.ts
import { CheckPay } from "@/app/lib/data";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idcbte = searchParams.get("idcbte");

    if (!idcbte) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }
    const response = await CheckPay(idcbte);
    if (response?.PagoExitoso) {
      //Redireccionar a la página de éxito
      /* return NextResponse.redirect(new URL(`/pay?idcbte=${idcbte}&IdResultado=${IdResultado}&IdReferenciaOperacion=${IdReferenciaOperacion}`, req.url)); */
      return NextResponse.json({ status: "ok" });
    } else {
      return NextResponse.json({ status: "error" });
    }

  } catch (error) {
    console.error("Error procesando pago QR:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}