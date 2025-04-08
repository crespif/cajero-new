import { cookies } from "next/headers";
import { CheckPay } from "../lib/data";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PayStatus({
  searchParams,
}: {
  searchParams?: {
    idcbte: number;
    IdResultado: string;
    IdReferenciaOperacion: number;
  };
}) {

  async function estadoPago() {
    const hash = cookies().get(`h${searchParams?.idcbte}`)?.value ?? "";
    const idres = searchParams?.IdResultado ?? "";
    const res = await CheckPay(idres, hash);


    if (res.PagoExitoso) {
     
      await fetch(`http://200.45.235.121:3000/factura/pago`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "idcbte": `${res.Request.nro_comprobante}`,
          "fecha_pago": `${new Date(res.FechaRegistro)}`,
          "idoperacion": `${res.IdOperacion}`,
          "importe": parseInt(res.Request.Importe),
          "hash": `${hash}`,
        }) 
      });
      return true;
    } else {
      console.log("error: pago no exitoso");
      return false;
    }
  }

  if (cookies().get(`h${searchParams?.idcbte}`)?.value == undefined) {
    console.log("error: no se encontro la cookie");
    redirect("/");
  } else {
    const res = await estadoPago();
    if (res) {
      return (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="green"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>

          <h1>El pago se ha realizado con éxito</h1>
          <Link
            href={"/"}
            className="text-white rounded border bg-blue-400 hover:bg-blue-600 px-4 py-2"
          >
            Volver
          </Link>
        </>
      );
    } else {
      return (
        <>
          <div className="flex items-center flex-col">
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
            <h1>Error en el pago / Pago cancelado</h1>
          </div>
          <Link
            href={"/"}
            className="text-white rounded border bg-blue-400 hover:bg-blue-600 px-4 py-2"
          >
            Volver
          </Link>
        </>
      );
    }
  }
}
