export default async function handler(req, res) {
  const data = JSON.parse(req.body);
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
    res.status(200).json(response);
  }
  else res.status(500).send('Not found'); 

  //res.status(200).json(JSON.parse(req.body));
   
}
