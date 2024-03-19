import { cookies } from "next/headers";
import { CheckPay } from "../lib/data";

export default async function PayStatus({
  searchParams,
}: {
  searchParams?: {
    idcbte: number;
    IdResultado: string;
    IdReferenciaOperacion: number;
  };
}) {

  const estadoPago =  async() => {
    const hash = cookies().get(`h${searchParams?.idcbte}`)?.value ?? '';
    const idres = searchParams?.IdResultado ?? '';
    const res = await CheckPay(idres, hash);
    if (res.PagoExitoso) {
      console.log("pago exitoso");
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
      console.log("pago no exitoso");
    }

    
    
  }

  if (cookies().get(`h${searchParams?.idcbte}`)?.value == undefined) {
    console.log("error");
    //redirect("/");
  } else {
    estadoPago();
  }


}
