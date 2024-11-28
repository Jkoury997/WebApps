import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const NEXT_PUBLIC_URL_API_MANITAS = process.env.NEXT_PUBLIC_URL_API_MANITAS;
const NEXT_PUBLIC_EMPRESA_ID_MANITAS = process.env.NEXT_PUBLIC_EMPRESA_ID_MANITAS

export async function POST(req) {
    try {
        const body = await req.json();

        const empresa = NEXT_PUBLIC_EMPRESA_ID_MANITAS
         // Validar los campos obligatorios en el cuerpo de la solicitud
         const { nombre, direccion, telefono,pais,barrio,ciudad } = body;


        // Enviar la solicitud de creación de empresa al backend
        const response = await fetch(`${NEXT_PUBLIC_URL_API_MANITAS}/api/lugares/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, direccion, telefono, pais,barrio,ciudad,empresa })
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
