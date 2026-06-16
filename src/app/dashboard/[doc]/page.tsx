import Link from "next/link";
import SelectSumin from "../select";
import { fetchClient, fetchinvoices } from "@/app/lib/data";
import Alert from "@/app/ui/alert";
import SurveyPopup from "@/app/ui/survey-popup";

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
        {/* <SurveyPopup personaNro={clientes[0].PersonaNro} /> */}
        {/* Alerta personalizada sin shadcn */}
        {/* <Alert /> */}
        <div className="grow overflow-auto w-full px-6 lg:px-24 py-6">
          <SelectSumin clientes={clientes} facturas={facturas}/>
        </div>
        <Link href="/" className="btn-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Volver
        </Link>
      </>
    );
  } catch (error) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3 p-6">
        <p style={{color:'var(--c-muted)', fontSize:'0.9375rem'}}>No se encontró el cliente</p>
        <Link href="/" className="btn-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Volver
        </Link>
      </div>
    );
  }
}
