import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const NEXT_PUBLIC_URL_API_LUX = process.env.NEXT_PUBLIC_URL_API_LUX;

export async function GET(req) {
    // Obtener las cookies
    const cookieStore = cookies();
    const Token = cookieStore.get("Token");
    
    // Obtener el parámetro `tienda` desde el query de la URL
    const { searchParams } = new URL(req.url);
    const tienda = searchParams.get('tienda');

    // Verificar si el token está presente
    if (!Token || !Token.value) {
        return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    try {
        // Verificar que la URL de la API esté definida
        if (!NEXT_PUBLIC_URL_API_LUX) {
            throw new Error('API URL is not defined');
        }

        // Verificar si el parámetro `Tienda` está presente
        if (!tienda) {
            return NextResponse.json({ error: "Tienda query parameter is missing" }, { status: 400 });
        }

        // Enviar la solicitud al backend
        const response = await fetch(`${NEXT_PUBLIC_URL_API_LUX}/api/Envios/ConsultarEnvio?Tienda=${tienda}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Token': Token.value  // Cambiar a 'Authorization': `Bearer ${Token.value}` si es necesario
            }
        });

        // Validar si la respuesta es exitosa
        const responseData = await response.json();
        if (response.ok) {
            return NextResponse.json(responseData);
        } else {
            return NextResponse.json({ error: responseData.Mensaje || 'Error en la respuesta de la API' }, { status: response.status });
        }

    } catch (error) {
        // Manejo de errores generales
        return NextResponse.json({ error: error.message || 'Error durante la obtención de datos' }, { status: 500 });
    }
}
