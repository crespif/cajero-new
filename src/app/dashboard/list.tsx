import { useRouter } from "next/navigation";
import { Factura } from "../lib/definitions";
import {
  DocumentTextIcon,
  CreditCardIcon,
} from "@heroicons/react/24/solid";

export default async function ListInvoice({
  facturas,
  doc
}: {
  facturas: Factura[];
  doc: string;
}) {
  const router = useRouter();

  const handlePayLoad = (invoice: Factura) => async () => {
    // encriptar el icbte de invoice
    //router.push(`/pay/${invoice.FacturaID}`, { state: { fac: invoice }});
 /*    const queryParams = new URLSearchParams({
      fc: JSON.stringify(invoice),
    }).toString();
    router.push(`/pay/${invoice.FacturaID}?${queryParams}`); */
    router.push(`/pay/${invoice.FacturaID}?doc=${doc}`);
  };

  const handleLinkClick = (invoice: any) => {
    /* codificador */
    const facturaString = JSON.stringify(invoice);
    const facturaBase64 = btoa(facturaString);
    const facturaEncoded = encodeURIComponent(facturaBase64);
    window.open(`/dashboard/factura?cupon=${facturaEncoded}`, "_blank");
  };

  return (
    <div className="mt-5 overflow-auto">
      <h2 className="text-center mb-2">Listado de facturas</h2>
      <div className="">
        {facturas.map((invoice: Factura, index: any) => (
          <div key={index}>
            <div className="flex flex-row p-2 gap-2 border border-gray-200 rounded-md mb-2 items-center">
              <DocumentTextIcon className="md:w-6 md:h-6 text-gray-500 w-16 h-16" />
              <div className="flex md:flex-row flex-col md:gap-2 gap-1 my-auto w-8/12 text-xs">
                <span className=" text-gray-600 md:text-center">
                {/* {`${(invoice.FacturaID).slice(0, 2)}-${(invoice.FacturaID).slice(2,3)}-${(invoice.FacturaID).slice(3,7)}-${(invoice.FacturaID).slice(7,15)}`} */}
                  Factura N°: <strong>{`${(invoice.FacturaID).slice(3,7)}-${(invoice.FacturaID).slice(7,15)}`}</strong>
                </span>
                <span className=" text-gray-600 md:text-center">
                  Importe:{" "}
                  <strong>
                    {invoice.FacturaSal.toLocaleString("es-ar", {
                      style: "currency",
                      currency: "ARS",
                      minimumFractionDigits: 2,
                    })}
                  </strong>
                </span>
                <span className=" text-gray-600 md:text-center">
                  Vencimiento:{" "}
                  <strong>
                    {new Date(invoice.FacturaFV).toLocaleDateString("es-ar")}
                  </strong>
                </span>
              </div>
              <div className="flex md:flex-row flex-col md:gap-2 gap-1 my-auto w-6/12 justify-end">
                {invoice.FacturaDA == "N" && invoice.FacturaSal > 0 && (
                  <>
                    {invoice.FacturaSal < 999999.99 && (
                      <button
                        className="bg-blue-800 text-white rounded-md  text-xs flex items-center w-32 p-1  hover:bg-blue-600"
                        onClick={handlePayLoad(invoice)}
                      >
                        <CreditCardIcon className="w-6 h-6 text-white mr-1 " />
                        Pagar
                      </button>
                    )}
                    {
                      // TODO hay un problema con el cupon de pago, no se puede generar el codigo de barras porque para generar el digito verificador se necesita el ID como numero
                      ((invoice.FacturaSal) < 99999.99) && 
                      <button className="bg-orange-800 text-white rounded-md  text-xs flex items-center w-32 p-1 hover:bg-orange-600" onClick={() => handleLinkClick(invoice)}>
                        <DocumentTextIcon className="w-6 h-6 text-white mr-1 " />
                        Cupon de pago
                      </button> 
                    }
                  </>
                )}

                {/* <Link 
                  href={`https://celtatsas.com.ar/sucursalvirtual/fac/${(new Date (invoice.FacturaFE)).getMonth()+1}/${(invoice.CuentaNIS).toString().padStart(8,0)}FAC${(invoice.FacturaID).padStart(2,0)}${(invoice.FacturaID)}${(invoice.FacturaID).toString().padStart(8,0)}.pdf`}
                  target="_blank" 
                  className="bg-green-800 text-white rounded-md  text-xs flex items-center p-1 w-32  hover:bg-green-600"
                >
                  <DocumentArrowDownIcon className="w-6 h-6 text-white mr-1 " />
                  Ver
                </Link> */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
