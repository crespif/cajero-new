
import { getFacturaById, payment, session } from "../../lib/data";
import Error from "@/app/ui/error";
import Status from "./status";
import ErrorSavePago from "@/app/ui/errorSavePago";

export default async function Pay({params, searchParams} : {params: {fc: string, doc: string}, searchParams?: {[key: string] : string}}) {

  const fc = params.fc;
  const doc = searchParams?.doc || '';;
  const sesion = await session();
  // la division no es la ",", sino %2C, por lo que hay que reemplazarlo
  const fcDecoded = decodeURIComponent(fc);
  const ids = fcDecoded.split(',');
  const facts = await Promise.all(ids.map((id) => getFacturaById(doc, id)));

  if (!sesion.access_token) {
    return <Error />
  } else {
  
    const pago = await payment(sesion, facts, fc);
    if (pago.Url) {
      return <Status Url={pago.Url}/>
    } else {
      /* console.log(pago.ModelState["pago_request.nro_comprobante"][0]);
      if (pago.ModelState["pago_request.nro_comprobante"][0].includes("ya cargado")) {
        return <ErrorSavePago />
      } */
      if (pago.ModelState["pago_request.nro_comprobante"] !== undefined) {
        return (
          <ErrorSavePago />
        ) 
      }
      return (
        <Error />
      ) 
    }  
  } 
  
} 
