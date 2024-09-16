import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
const NEXT_PUBLIC_URL_API_MANITAS = process.env.NEXT_PUBLIC_URL_API_MANITAS;

export async function POST(req) {
    const body = await req.json();


    try {


        // Agregar el campo 'creadoPor' al cuerpo de la solicitud
        const updatedBody = {
            ...body,
            creadoPor: "Sin datos",  // Agregar el token en el campo 'creadoPor'
        };

        // Enviar la solicitud al backend
        const response = await fetch(`${NEXT_PUBLIC_URL_API_MANITAS}/api/categorias/create`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedBody),
        });

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
