import { CheckPay, session } from "@/app/lib/data";


export default async function CheckPayFront({idResultado, IdReferenciaOperacion} : {idResultado: string, IdReferenciaOperacion: string}) {


  const checkin = await CheckPay(idResultado, IdReferenciaOperacion);

  if (checkin) {
    return (
      <>
        <h1>El pago se ha realizado con éxito</h1>
        <h2>IdResultado: {idResultado}</h2>
        <h2>IdReferenciaOperacion: {IdReferenciaOperacion}</h2>
      </>
    )
  } else {
    return (
      <>
        <h1>El pago no se ha realizado con éxito</h1>
        <h2>IdResultado: {idResultado}</h2>
        <h2>IdReferenciaOperacion: {IdReferenciaOperacion}</h2>
      </>
    )
  }

}