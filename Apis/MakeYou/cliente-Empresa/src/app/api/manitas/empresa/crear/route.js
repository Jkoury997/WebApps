import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const NEXT_PUBLIC_URL_API_MANITAS = process.env.NEXT_PUBLIC_URL_API_MANITAS;

export async function POST(req) {
    try {
        const body = await req.json();

        // Supongamos que el cuerpo de la solicitud incluye el nombre, dirección, teléfono y email
        const { nombre, direccion, telefono, email } = body;

        // Enviar la solicitud de creación de empresa al backend
        const response = await fetch(`${NEXT_PUBLIC_URL_API_MANITAS}/api/empresas/crear`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, direccion, telefono, email })
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