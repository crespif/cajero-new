import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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
    console.log(res);
  }

  console.log(searchParams);

  if (cookies().get(`h${searchParams?.idcbte}`) == undefined) {
    console.log("error");
    //redirect("/");
  } else {
    estadoPago();
  }


  
  

  return (
    <div>
      <h1>Obteniendo información del pago...</h1>
    </div>
  );
}
