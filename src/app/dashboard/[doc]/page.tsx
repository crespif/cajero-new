import Link from "next/link";
import SelectSumin from "../select";
import { fetchClient, fetchinvoices } from "@/app/lib/data";

export default async function Dashboard({
  params,
}: {
  params: { doc: number };
}) {
  const doc = params.doc;

  try {
    const clientes = await fetchClient(doc);
    if (clientes.length === 0) {
      throw new Error("Cliente no encontrado");
    } 
    const facturas = await fetchinvoices(clientes[0].CuentaDoc);
    //const facturas = await getFacturas(clientes[0].CuentaDoc);

    return (
      <>
        <div className="grow overflow-auto">
          <SelectSumin clientes={clientes} facturas={facturas}/>
        </div>
        <Link
          href="/"
          className="flex items-center w-36 justify-center gap-2 self-start rounded-lg bg-blue-500 my-2 py-1 px-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base m-auto"
        >
          <span>Volver</span>
        </Link>
      </>
    );
  } catch (error) {
    return (
      <div>
        <h1>Cliente no encontrado</h1>
        <Link
          href="/"
          className="flex items-center w-36 justify-center gap-2 self-start rounded-lg bg-blue-500 my-2 py-1 px-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base m-auto"
        >
          <span>Volver</span>
        </Link>
      </div>
    );
  }
}
