import { NextResponse } from 'next/server';

const NEXT_PUBLIC_URL_API_MANITAS = process.env.NEXT_PUBLIC_URL_API_MANITAS;

export async function POST(req) {
    const body = await req.json();
    console.log(body)

    try {
        // Enviar la solicitud al backend
        const response = await fetch(`${NEXT_PUBLIC_URL_API_MANITAS}/api/lugares/create`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        // Si la respuesta no es OK (2xx), lanzar un error con el mensaje de respuesta
        if (!response.ok) {
            const errorData = await response.json(); // Obtener detalles del error si están disponibles
            throw new Error(errorData.message || 'Error en la solicitud al backend');
        }

        // Obtener la respuesta JSON
        const responseData = await response.json();

        // Devolver la respuesta en caso de éxito
        return NextResponse.json(responseData);
    } catch (error) {
        // Manejo de errores generales
        console.error('Error en la solicitud:', error);
        return NextResponse.json({ error: error.message || 'Error during data retrieval' }, { status: 500 });
    }
}
