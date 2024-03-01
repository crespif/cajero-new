export async function GET(req: Request, { params } : { params: { id: string }}) {
 const id = params.id;
 try {
    const response = await fetch(`http://200.45.235.121:3000/suministro/dni/${id}`);
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
      'Cliente no encontrado',
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  }
} 