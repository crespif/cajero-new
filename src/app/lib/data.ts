import { revalidateTag } from "next/cache";

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


export async function fetchinvoices(id: number) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/suministro/${id}`)
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


export async function fetchinvoice(id: number) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL_CELTA}/factura/${id}`)
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
      `${process.env.NEXT_PUBLIC_URL_SIRO_SESION_PRUEBA}`,
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

export async function payment(sesion: any, data: any) {
  data = data[0];

  try {   
    const query = await fetch(`${process.env.NEXT_PUBLIC_URL_SIRO_PAGO_PRUEBA}`, {
      method: "POST",
      headers: {
        "Authorization": `${sesion.token_type} ${sesion.access_token}`,
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "nro_cliente_empresa": `${(data.idcbte).toString().padStart(9,0)}5120185697`,
        "nro_comprobante": `${(data.idcbte).toString().padStart(20,0)}`,
        "Concepto": `Factura CELTA Nro ${(data.idsucursal).toString().padStart(4,0)} ${(data.nrocbte).toString().padStart(8,0)}`,
        "Importe": parseFloat(data.srv_saldo),
        "URL_OK": `http://www.google.com.ar`,
        "URL_ERROR": `http://www.google.com.ar`,
        "IdReferenciaOperacion": `425`,
        "Detalle": [{'Descripcion': `${data.cat_desc}`, 'Importe': `${data.srv_saldo}`}]
      }),
    });
    const response = await query.json();
    return response;
    
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function CheckPay(idResultado: string, IdReferenciaOperacion: string): Promise<boolean>{

  const sesion = await session();

  if (!sesion.access_token) {
    return false;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL_SIRO_PAGO_PRUEBA}?IdResultado=${idResultado}&IdReferenciaOperacion=${IdReferenciaOperacion}`, {
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