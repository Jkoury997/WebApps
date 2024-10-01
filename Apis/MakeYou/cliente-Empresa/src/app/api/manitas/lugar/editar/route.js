import { NextResponse } from 'next/server';

const NEXT_PUBLIC_URL_API_MANITAS = process.env.NEXT_PUBLIC_URL_API_MANITAS;

export async function PUT(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');  // Obtiene el valor de 'id' desde la query string

        // Verifica si el ID está presente
        if (!id) {
            return NextResponse.json({ error: 'ID de Lugar no proporcionado' }, { status: 400 });
        }
        
        const body = await req.json();

        // Supongamos que el cuerpo de la solicitud incluye el nombre, dirección, teléfono y email
        const { nombre, direccion, telefono,pais,barrio,ciudad } = body;

        // Enviar la solicitud de creación de empresa al backend
        const response = await fetch(`${NEXT_PUBLIC_URL_API_MANITAS}/api/lugares/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, direccion, telefono,pais,barrio,ciudad })
        });

        const responseData = await response.json();
        
        if (response.ok) {
            
            // Retorna la respuesta en caso de éxito
            return NextResponse.json(responseData);
        } else {
            // Manejo de errores específicos de la API, como un 401
            return NextResponse.json({ error: responseData.Mensaje || 'Error en la solicitud' }, { status: response.status });
        }
    } catch (error) {
        // Manejo de errores generales
        return NextResponse.json({ error: error.message || 'Error during request' }, { status: 500 });
    }
}
