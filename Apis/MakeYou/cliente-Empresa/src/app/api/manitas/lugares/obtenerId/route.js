import { NextResponse } from 'next/server';

const NEXT_PUBLIC_URL_API_MANITAS = process.env.NEXT_PUBLIC_URL_API_MANITAS;

// Manejar el método GET para obtener una empresa por ID
export async function GET(req) {
    try {
        // Obtener el query parameter 'id' desde la URL
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');  // Obtiene el valor de 'id' desde la query string

        // Verifica si el ID está presente
        if (!id) {
            return NextResponse.json({ error: 'ID de Lugar no proporcionado' }, { status: 400 });
        }

        // Enviar la solicitud al backend para obtener la empresa por su ID
        const response = await fetch(`${NEXT_PUBLIC_URL_API_MANITAS}/api/lugares/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Obtener los datos de la respuesta
        const responseData = await response.json();

        // Verificar si la solicitud fue exitosa
        if (response.ok) {
            return NextResponse.json(responseData);
        } else {
            return NextResponse.json({ error: responseData.Mensaje || 'Error en la solicitud' }, { status: response.status });
        }
    } catch (error) {
        // Manejo de errores generales
        return NextResponse.json({ error: error.message || 'Error during request' }, { status: 500 });
    }
}
