import { CheckPay } from "@/app/lib/data";
import Link from "next/link";


export default async function CheckPayFront({IdReferenciaOperacion} : {IdReferenciaOperacion: string}) {


  const checkin = await CheckPay(IdReferenciaOperacion);

  if (checkin) {
    return (
      <>
        <h1>El pago se ha realizado con éxito</h1>
        <h2>IdReferenciaOperacion: {IdReferenciaOperacion}</h2>
      </>
    )
  } else {
    return (
      <>
        <h1>El pago no se ha completado</h1>
        <h2>IdReferenciaOperacion: {IdReferenciaOperacion}</h2>
        <Link href={"/"}>
          Volver
        </Link>
      </>
    )
  }

}