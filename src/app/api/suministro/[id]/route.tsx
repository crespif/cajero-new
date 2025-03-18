import { NextResponse } from "next/server";
import { createClient } from "soap";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const SOAP_URL = process.env.NEXT_PUBLIC_WS_GLM!;
  try {
    const client = await new Promise((resolve, reject) => {
      createClient(SOAP_URL, (err, client) => {
        if (err) {
          console.error("Error al crear el cliente SOAP:", err);
          reject(new Error("Error al crear el cliente SOAP"));
        } else {
          client.WSCuentasBP.WSCuentasBPSoapPort.FACTURAS(
            { Documento: `${id}` },
            (err: any, result: any) => {
              if (err) {
                console.error("Error en la solicitud SOAP:", err);
                reject(new Error("Error en la solicitud SOAP"));
              } else {
                const facturas = result?.Sdtbpfac?.FacturasBP
                  ? result.Sdtbpfac.FacturasBP["FacturasBP.FacturasBPItem"] ||
                    []
                  : [];
                resolve(facturas);
              }
            }
          );
        }
      });
    });
    const facturas = (client as any) ? client : [];
    return NextResponse.json(facturas, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error },
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}
