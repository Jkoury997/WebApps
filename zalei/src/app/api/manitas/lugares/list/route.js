import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const NEXT_PUBLIC_URL_API_MANITAS = process.env.NEXT_PUBLIC_URL_API_MANITAS;
console.log(NEXT_PUBLIC_URL_API_MANITAS)

export async function GET(req) {
  try {
    console.log("entre")
    // Enviar la solicitud al backend
    const response = await fetch(`${NEXT_PUBLIC_URL_API_MANITAS}/api/lugares/list`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json', // Intenta añadir este header

      },
      next: { revalidate: 0 }, // Asegurarse que la solicitud no se cachee
    });

    // Obtener la respuesta JSON
    const responseData = await response.json();
    console.log(responseData)
    // Verificar si la solicitud fue exitosa
    if (response.ok) {
      // Devolver la respuesta en caso de éxito
      return NextResponse.json(responseData);
    } else {
      // Manejo de errores específicos de la API
      return NextResponse.json({ error: responseData }, { status: response.status });
    }
  } catch (error) {
    // Manejo de errores generales
    return NextResponse.json({ error: error.message || 'Error during data retrieval' }, { status: 500 });
  }
}
