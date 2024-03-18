import { cookies } from "next/headers";
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

  const estadoPago =  async() => {
    console.log(searchParams);
  }

  console.log(searchParams);

  if (cookies().get(`h${searchParams?.idcbte}`) == undefined) {
    console.log("error");
    redirect("/");
  } else {
    estadoPago();
  }


  
  

  return (
    <div>
      <h1>Obteniendo información del pago...</h1>
    </div>
  );
}
