
"use server"

import { createClient } from "soap";
import { Cliente, Factura } from "./definitions";

export async function fetchClient(id: number) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/client/${id}`)
    if (response.status === 200) {
      const data = await response.json();
      return data
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
  }
}


export async function fetchinvoices(id: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/suministro/${id}`);
    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
  }
}


export async function fetchinvoice(id: number) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/factura/${id}`)
    const data = await response.json()
    return data
  }
  catch (error) {
    console.error(error);
  }
}

export async function session(){
  try {
    const query = await fetch(
      `${process.env.NEXT_PUBLIC_URL_SIRO_SESION_PRODUCCION}`,
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Usuario: `${process.env.NEXT_PUBLIC_USER_PAGO}`,
          Password: `${process.env.NEXT_PUBLIC_PASS_PAGO}`,
        }),
        cache: "no-cache",
      }
    );
    const response = await query.json();

    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function payment(sesion: any, data: Factura, fc: string) {
  try {   
    const query = await fetch(`${process.env.NEXT_PUBLIC_URL_SIRO_PAGO_PRODUCCION}`, {
      method: "POST",
      headers: {
        "Authorization": `${sesion.token_type} ${sesion.access_token}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "nro_cliente_empresa": `${(data.PersonaNro).toString().padStart(9,'0')}5120185697`,
        "nro_comprobante": `${(data.FacturaID).toString().padStart(20,'0')}`,
        "Concepto": `Factura CELTA Nro ${(data.FacturaID).slice(3,7)} ${(data.FacturaID).slice(7,15)}`,
        "Importe": (data.FacturaSal).toFixed(2),
        "URL_OK": `https://cajero-new.vercel.app/pay?idcbte=${fc}`,
        "URL_ERROR": `https://cajero-new.vercel.app/pay`,
        "IdReferenciaOperacion": `425`,
        "Detalle": [{'Descripcion': `Suministro: ${data.CuentaNIS}, Factura: ${(data.FacturaID).slice(3,7)}-${(data.FacturaID).slice(7,15)}`, 'Importe': `${(data.FacturaSal).toFixed(2)}`}]
      }),
     /*  body: JSON.stringify({
        "nro_cliente_empresa": `${(data.idcbte).toString().padStart(9,0)}5150058293`,
        "nro_comprobante": `${(data.idcbte).toString().padStart(20,0)}`,
        "Concepto": `Factura CELTA Nro ${(data.idsucursal).toString().padStart(4,0)} ${(data.nrocbte).toString().padStart(8,0)}`,
        "Importe": 998.50,
        "URL_OK": `https://cajero-new.vercel.app//pay?idcbte=${fc}`,
        "URL_ERROR": `https://cajero-new.vercel.app//pay`,
        "IdReferenciaOperacion": `425`,
        "Detalle": [{'Descripcion': `${data.cat_desc}`, 'Importe': 998.50}]
      }), */
    });
    const response = await query.json();
    return response;
    
  } catch (error) {
    return error;
  }
}

export async function CheckPay(idResultado: string, Hash: string) {

  const sesion = await session();

  if (!sesion.access_token) {
    return false;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_SIRO_PAGO_PRODUCCION}/${Hash}/${idResultado}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `${sesion.token_type} ${sesion.access_token}`,
    },
    cache: "no-cache",
  });
  const data = await res.json();
  return data;

  
}

export async function getFacturaById(doc: string, id: string): Promise<Factura> {

  const SOAP_URL = process.env.NEXT_PUBLIC_WS_GLM!;

  return new Promise((resolve, reject) => {
    createClient(SOAP_URL, (err, client) => {
      if (err) {
        console.error("Error al crear el cliente SOAP:", err);
        reject(new Error("Error al crear el cliente SOAP"));
      } else {
        client.WSCuentasBP.WSCuentasBPSoapPort.FACTURAS(
          { Documento: `${doc}` },
          (err: any, result: any) => {
            if (err) {
              console.error("Error en la solicitud SOAP:", err);
              reject(new Error("Error en la solicitud SOAP"));
            } else {
              const facturas = result?.Sdtbpfac?.FacturasBP
                ? result.Sdtbpfac.FacturasBP["FacturasBP.FacturasBPItem"] || []
                : [];
              resolve(facturas.find((f: Factura) => f.FacturaID === id));
            }
          }
        );
      }
    });
  });
}