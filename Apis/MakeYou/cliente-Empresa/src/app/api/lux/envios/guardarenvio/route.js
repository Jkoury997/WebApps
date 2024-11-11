import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const NEXT_PUBLIC_URL_API_LUX = process.env.NEXT_PUBLIC_URL_API_LUX;

export async function POST(req) {

        // Obtener las cookies
        const cookieStore = cookies();
        const Token = cookieStore.get("Token");

  try {
    // Obtener los datos del cuerpo de la solicitud
    const body = await req.json();
    console.log(body)

    // Hacer la solicitud a la API externa
    const response = await fetch(`${NEXT_PUBLIC_URL_API_LUX}/api/Envios/GuardarEnvio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Token': Token.value // Reemplaza con el token correcto o con una variable de entorno
      },
      body: JSON.stringify(body),
    });

    // Verificar si la solicitud fue exitosa
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData }, { status: response.status });
    }

    // Obtener y retornar los datos de la respuesta
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    // Manejo de errores en caso de que ocurra un problema con la solicitud
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
