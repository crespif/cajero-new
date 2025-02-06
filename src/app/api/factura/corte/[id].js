export default async function handler(req, res) {
   const {id} = req.query;
   const query = await fetch(`http://200.45.235.121:3000/factura/corte/${id}`, {
      method: 'DELETE',
   });
   if (query.ok){
     const data = await query.json();
     res.status(200).json(data);
   } else if (query.status === 404) {
      res.status(404).send('Factura no encontrada');
   }
   else res.status(500).send('Not found');
 }
 