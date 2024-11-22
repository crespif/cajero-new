import { cookies } from "next/headers";
import { CheckPay } from "../lib/data";
import Link from "next/link";

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
    const hash = cookies().get(`h${searchParams?.idcbte}`)?.value ?? '';
    const idres = searchParams?.IdResultado ?? '';
    const res = await CheckPay(idres, hash);
    
    if (res.PagoExitoso) {
      return true;
      /* 
        - TODO guardar pago en la base de datos 
        - datos a guardar: 
         > idcbte
         > fecha_pago : res.FechaRegistro
         > idoperacion: res.IdOperacion
         > importe: res.Importe (ver)
         > hash: 

         antes :
         "idcbte": Number(resPago.Request.nro_comprobante),
          "fecha_pago": new Date(resPago.FechaRegistro),
          "idoperacion": resPago.IdOperacion,
          "importe": Number(resPago.Request.Importe),
          "hash": getCookie(error.idfc),


          respuesta: 
          {
            PagoExitoso: false,
            MensajeResultado: null,
            FechaOperacion: null,
            FechaRegistro: '2024-03-18T13:29:19.917',
            IdOperacion: 'bcc30701-c809-4c38-8b50-f3949f8afd84',
            Estado: 'GENERADA',
            idReferenciaOperacion: '425',
            Request: {
              nro_cliente_empresa: '0111325165120185697',
              nro_comprobante: '00000000000011132516',
              Concepto: 'Factura CELTA Nro 0020 00661457',
              Importe: 10250,
              URL_OK: 'https://cajero-new.vercel.app/pay?idcbte=1150607236',
              URL_ERROR: 'https://cajero-new.vercel.app/pay',
              IdReferenciaOperacion: '425',
              Detalle: [ [Object] ]
            },
            Rendicion: null
          }
       */
    } else {
      return false
    }
  }

  if (cookies().get(`h${searchParams?.idcbte}`)?.value == undefined) {
    console.log("error");
    //redirect("/");
  } else {
    const res = await estadoPago();
    if (res) {    
      return (
        <>
          <h1>El pago se ha realizado con éxito</h1>
          <h2>IdResultado: {searchParams?.IdResultado}</h2>
          <h2>IdReferenciaOperacion: {searchParams?.IdReferenciaOperacion}</h2>
        </>
      )
    } else {
      return (
        <>
          <div className="flex items-center flex-col">
            <svg xmlns="http://www.w3.org/2000/svg" fill="yellow" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <h1>Error en el pago / Pago cancelado</h1>
          </div>
          {/* <h2>IdResultado: {searchParams?.IdResultado}</h2>
          <h2>IdReferenciaOperacion: {searchParams?.IdReferenciaOperacion}</h2> */}
          <Link href={"/"} className="text-white rounded border bg-blue-400 hover:bg-blue-600 px-4 py-2">
            Volver
          </Link>
        </>
      )
    }
  }



}
