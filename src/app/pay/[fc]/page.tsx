
import { redirect } from "next/navigation";
import { fetchinvoice, payment, session } from "../../lib/data";
import Error from "@/app/ui/error";


export default async function Pay({params} : {params: {fc: number}}) {

  const fc = params.fc;
  const sesion = await session();

  if (!sesion.access_token) {
    console.log(sesion);
    return <Error />
  } else {
    const fact = await fetchinvoice(fc  ^ Number(process.env.NEXT_PUBLIC_HASH));
    const pago = await payment(sesion, fact);
    if (pago.Url) {
      redirect(pago.Url);
    } else {
      console.log(pago);
      return (
        <Error />
      ) 
    }
  }
  

  return (
    <div className="flex">
      <svg className="animate-spin h-5 w-5 mr-3 border-2 rounded-xl border-t-2 border-t-black " viewBox="0 0 24 24">
        ...
      </svg>
      <h1 className="animate-pulse">Redirigiendo a la plataforma de pago</h1>.
    </div>
  )
}