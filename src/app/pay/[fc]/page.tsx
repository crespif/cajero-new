 
import { redirect } from "next/navigation";
import { fetchinvoice, payment, session } from "../../lib/data";
import Error from "@/app/ui/error";
import Status from "./status";
import { cookies } from "next/headers";

export default async function Pay({params} : {params: {fc: number}}) {

  const fc = params.fc;
  const sesion = await session();
  if (!sesion.access_token) {
    return <Error />
  } else {    if (cookies().get(`h${fc}`)) {
      //redirect(`${process.env.NEXT_PUBLIC_URL_SIRO_PAGO_PRODUCCION}/${cookies().get(`h${fc}`)?.value}`);
      redirect(`${process.env.NEXT_PUBLIC_URL_SIRO_PAGO_PRODUCCION}/${cookies().get(`h${fc}`)?.value}`);
    }
    const fact = await fetchinvoice(fc  ^ Number(process.env.NEXT_PUBLIC_HASH));
    const pago = await payment(sesion, fact, fc);
 
    if (pago.Url) {
      return <Status Fc={fc} Url={pago.Url} Hash={pago.Hash} />
    } else {
      return (
        
        <Error />
      ) 
    } 
  } 
  
} 
