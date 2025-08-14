
import { getFacturaById, payment, session } from "../../lib/data";
import Error from "@/app/ui/error";
import Status from "./status";
import ErrorSavePago from "@/app/ui/errorSavePago";

export default async function Pay({params, searchParams} : {params: {fc: string, doc: string}, searchParams?: {[key: string] : string}}) {

  const fc = params.fc;
  const doc = searchParams?.doc || '';;
  const sesion = await session();
  const fact = await getFacturaById(doc, fc);
  
  if (!sesion.access_token) {
    return <Error />
  } else {    
    const pago = await payment(sesion, fact, fc);
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
