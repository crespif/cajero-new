// app/api/payment-qr/route.ts
import { CheckPay } from "@/app/lib/data";
import { NextResponse } from "next/server";

// SIRO notifica a la URL_OK los cambios de estado de la intención de pago (puede llegar por GET o POST)
async function handle(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const body = req.method === "POST" ? await req.text() : "";
    console.log("Notificación /api/payment:", req.method, req.url, body);

    // si SIRO agrega sus parámetros con otro "?", el valor de idcbte queda "123?id_resultado=..."
    let idcbte = searchParams.get("idcbte")?.split("?")[0] ?? searchParams.get("IdReferenciaOperacion");
    if (!idcbte && body) {
      try {
        const json = JSON.parse(body);
        idcbte = json.IdReferenciaOperacion ?? json.idReferenciaOperacion ?? null;
      } catch {}
    }

    if (!idcbte) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }
    const response = await CheckPay(idcbte, 'QR');
    console.log("Resultado CheckPay /api/payment:", idcbte, response?.Estado, response?.PagoExitoso);
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

export const GET = handle;
export const POST = handle;
