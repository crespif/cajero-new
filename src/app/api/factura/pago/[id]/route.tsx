export async function GET(request: Request, { params }: { params: { id: string } }) {
    const id = params.id;
    try {
        const query = await fetch(`http://200.45.235.121:3000/factura/pago/${id}`);
        const data = await query.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Error al buscar el pago" }), { status: 500 });
    }
}