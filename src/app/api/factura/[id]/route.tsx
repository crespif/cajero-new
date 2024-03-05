export async function GET(req: Request, { params } : { params: { id: string }}) {
  const id = params.id;
  try {
     const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL_CELTA}/factura/${id}`);
     const data = await response.json();
     return  new Response(
       JSON.stringify(data),
       {
         status: 200,
         headers: {
           "Content-Type": "application/json",
         }
       }
     );
   } catch (error) {
     console.error(error);
     return new Response(
       'El suministro no posee facturas',
       {
         status: 400,
         headers: {
           "Content-Type": "application/json",
         },
       }
     )
   }
 } 