import { NextResponse } from 'next/server';


const URL_API_AUTH = process.env.NEXT_PUBLIC_URL_API_AUTH;

export async function GET(req) {
    try {


        // Enviar la solicitud de actualización de usuario al backend
        const response = await fetch(`${URL_API_AUTH}/api/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const responseData = await response.json();

        if (response.ok) {
            return NextResponse.json(responseData);
        } else {
            // Retornar el error si la solicitud al backend falló
            return NextResponse.json({ error: responseData.message }, { status: response.status });
        }
    } catch (error) {
        // Manejo de errores generales
        return NextResponse.json({ error: error.message || 'Error during get list' }, { status: 500 });
    }
}
