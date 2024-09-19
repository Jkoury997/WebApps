import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const NEXT_PUBLIC_URL_API_ZYRA = process.env.NEXT_PUBLIC_URL_API_ZYRA;

export async function POST(req) {
    const cookieStore = cookies();
    const Token = cookieStore.get("Token");
    
    // Obtener el body
    const body = await req.json();
    console.log(body)

    try {
        // Realizar la solicitud a la API externa
        const response = await fetch(`${NEXT_PUBLIC_URL_API_ZYRA}/api/Medias/ContarTejido`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Especificamos que estamos enviando JSON
                'Accept': 'application/json',
                'Token': Token?.value,  // Aseguramos que el token esté presente
            },
            body: JSON.stringify(body)
        });

        // Obtener los datos en formato JSON
        const data = await response.json();

        console.log(data)

       // Verificar si el Estado es falso y lanzar un error con el mensaje correspondiente
       if (!data.Estado) {
        return NextResponse.json({
            error: true,
            mensaje: data.Mensaje || 'Ocurrió un error en la solicitud',
            ...data
        }, { status: 400 });
    }

    // Devolver los datos al cliente si Estado es true
    return NextResponse.json(data);
    } catch (error) {
        // Manejar errores en la solicitud
        return NextResponse.json({ error: 'Internal Server Error',message: error.message || 'Ocurrió un error desconocido' }, { status: 500 });
    }
}
