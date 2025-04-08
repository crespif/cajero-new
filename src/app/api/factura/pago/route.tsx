export async function POST(req: Request) {
    const data = JSON.parse(await req.text());  
    console.log(data);
    const query = await fetch(`http://200.45.235.121:3000/factura/pago`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "idcbte": `${data.idcbte}`,
        "fecha_pago": `${data.fecha_pago}`,
        "idoperacion": `${data.idoperacion}`,
        "importe": parseInt(data.importe),
        "hash": `${data.hash}`,
      }) 
    });
    if (query.ok){
      const response = await query.json();
      return new Response(
        JSON.stringify(response),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
    }
    else return new Response(
      'Not found',
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
     
  }
  