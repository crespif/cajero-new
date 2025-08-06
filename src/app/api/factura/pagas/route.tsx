export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cta = searchParams.get('cta');
  const sum = searchParams.get('sum');
  if (!cta || !sum) {
    return new Response(
      'Faltan parámetros',
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }
  try {
     const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL_CELTA}/factura/${cta}/${sum}?todas=true`);
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