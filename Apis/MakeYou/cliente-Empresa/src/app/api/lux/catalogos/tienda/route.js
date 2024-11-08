import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const NEXT_PUBLIC_URL_API_LUX = process.env.NEXT_PUBLIC_URL_API_LUX;

export async function GET(req) {
    const cookieStore = cookies();
    const Token = cookieStore.get("Token");

    if (!Token) {
        return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

           // Enviar la solicitud al backend
           const response = await fetch(`${NEXT_PUBLIC_URL_API_LUX}/api/Catalogos/Tiendas`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Token': Token.value
            }
        });

        const responseData = await response.json();

    try {

        

        if (response.ok) {
            // Devolver la respuesta en caso de éxito
            return NextResponse.json(responseData);
        } else {
            // Manejo de errores específicos de la API
            return NextResponse.json({ error: responseData.Mensaje }, { status: response.status });
        }
    } catch (error) {
        // Manejo de errores generales
        return NextResponse.json({ error: error.message || 'Error during data retrieval' }, { status: 500 });
    }
}
