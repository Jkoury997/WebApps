import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const NEXT_PUBLIC_URL_API_ZYRA = process.env.NEXT_PUBLIC_URL_API_ZYRA;

export async function GET(req) {
    const cookieStore = cookies();
    const Token = cookieStore.get("Token");
    
    // Obtener el ID de la URL (si está presente)
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');  // Capturamos el ID si existe en los parámetros de la URL

    // Construir la URL condicionalmente
    let apiUrl = `${NEXT_PUBLIC_URL_API_ZYRA}/api/Medias/Bolsa`;
    if (id) {
        apiUrl += `/${id}`;  // Si existe el id, agregarlo al final de la URL
    }

    try {
        // Realizar la solicitud a la API externa
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Token': Token?.value,  // Aseguramos que Token esté presente
            },
        });

        // Verificar si la respuesta es correcta
        if (!response.ok) {
            return NextResponse.json({ error: 'Error fetching data' }, { status: response.status });
        }

        // Obtener los datos en formato JSON
        const data = await response.json();

        // Devolver los datos al cliente
        return NextResponse.json(data);
    } catch (error) {
        // Manejar errores en la solicitud
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
