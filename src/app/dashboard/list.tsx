import { useRouter } from 'next/navigation'
import { fetchinvoices } from "../lib/data";
import { Cliente } from "../lib/definitions";
import { DocumentTextIcon, CreditCardIcon, DocumentArrowDownIcon, PrinterIcon, EyeIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { Suspense } from 'react';



export default async function ListInvoice({client} : {client: Cliente}) {
 
  const router = useRouter();
  const invoices = await fetchinvoices(client.idsuministro); 

  const handlePayLoad = (invoice: any) => async () => {

    // encriptar el icbte de invoice
    const icbte = invoice.idcbte ^ Number(process.env.NEXT_PUBLIC_HASH);
    router.push(`/pay/${icbte}`);
   
  }

  const handleLinkClick = (invoice: any) => {

    const factura = {
      idsuministro: client.idsuministro,
      cod_suministro: client.cod_suministro,
      idtipo_srv: invoice.idtipo_srv,
      idcbte: invoice.idcbte,
      srv_saldo: invoice.srv_saldo,
      nombre: invoice.nombre,
      domicilio_sumin: invoice.domicilio_sumin,
      idsucursal: invoice.idsucursal,
      letra: invoice.letra_cbte,
      nrocbte: invoice.nrocbte
    };

    /* codificador */
    const facturaString = JSON.stringify(factura);
    const facturaBase64 = btoa(facturaString);
    const facturaEncoded = encodeURIComponent(facturaBase64);
    window.open(`/dashboard/factura?cupon=${facturaEncoded}`, '_blank');

  }


  return (
    <div className="mt-5 overflow-auto">
      <h2 className="text-center mb-2">Listado de facturas</h2>
      <div className="">
        {invoices.map((invoice : any, index: any) => (
          <div key={index}>
            <div  className="flex flex-row p-2 gap-2 border border-gray-200 rounded-md mb-2 items-center">
              <DocumentTextIcon className="md:w-6 md:h-6 text-gray-500 w-16 h-16" />
              <div className="flex md:flex-row flex-col md:gap-2 gap-1 my-auto w-8/12 text-xs">
                <span className=" text-gray-600 md:text-center">Factura N°: <strong>{invoice.nrocbte}</strong></span>
                <span className=" text-gray-600 md:text-center">Importe: <strong>{(invoice.srv_importe).toLocaleString('es-ar', {style: 'currency', currency: 'ARS', minimumFractionDigits: 2})}</strong></span>
                <span className=" text-gray-600 md:text-center">Vencimiento: <strong>{(invoice.fecha_vto).substr(8,2)}/{(invoice.fecha_vto).substr(5,2)}/{(invoice.fecha_vto).substr(2,2)}</strong></span>
              </div>
              <div className="flex md:flex-row flex-col md:gap-2 gap-1 my-auto w-6/12 justify-end">
                {
                  invoice.debito != 1 &&
                  invoice.pago == null &&
                  invoice.srv_saldo > 0 &&
                  <>
                    {
                      (invoice.srv_saldo < 999999.99) &&
                      <button className="bg-blue-800 text-white rounded-md  text-xs flex items-center w-32 p-1  hover:bg-blue-600" onClick={handlePayLoad(invoice)}>
                        <CreditCardIcon className="w-6 h-6 text-white mr-1 " />
                        Pagar
                      </button>
                    }
                    {
                      (invoice.srv_saldo) < 99999.99 && 
                      <button className="bg-orange-800 text-white rounded-md  text-xs flex items-center w-32 p-1 hover:bg-orange-600" onClick={() => handleLinkClick(invoice)}>
                        <DocumentTextIcon className="w-6 h-6 text-white mr-1 " />
                        Cupon de pago
                      </button> 
                    }
                  </>
                }
                
                <Link 
                  href={`https://celtatsas.com.ar/sucursalvirtual/fac/${(new Date (invoice.fecha_emision)).getMonth()+1}/${(invoice.idsuministro).toString().padStart(8,0)}FAC${(invoice.idsucursal).toString().padStart(2,0)}${(invoice.letra_cbte)}${(invoice.nrocbte).toString().padStart(8,0)}.pdf`}
                  target="_blank" 
                  className="bg-green-800 text-white rounded-md  text-xs flex items-center p-1 w-32  hover:bg-green-600"
                >
                  <DocumentArrowDownIcon className="w-6 h-6 text-white mr-1 " />
                  Ver
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

}