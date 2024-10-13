// /app/api/zones/route.js
import { NextResponse } from 'next/server';

const NEXT_PUBLIC_URL_API_PRESENTISMO = process.env.NEXT_PUBLIC_URL_API_PRESENTISMO;
const NEXT_PUBLIC_EMPRESA_ID = process.env.NEXT_PUBLIC_EMPRESA_ID;

export async function GET(req) {
  // Validación de variables de entorno
  if (!NEXT_PUBLIC_URL_API_PRESENTISMO || !NEXT_PUBLIC_EMPRESA_ID) {
    return NextResponse.json({ error: 'Faltan variables de entorno requeridas' }, { status: 500 });
  }

  try {
    // Realizamos la solicitud para obtener las zonas
    const response = await fetch(`${NEXT_PUBLIC_URL_API_PRESENTISMO}/api/zones/${NEXT_PUBLIC_EMPRESA_ID}`, {
      next: { revalidate: 0 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Verificamos si la respuesta es exitosa
    if (!response.ok) {
      console.error('Error en la respuesta al obtener las zonas:', response.statusText);
      return NextResponse.json({ error: 'Error al obtener las zonas' }, { status: response.status });
    }

    // Obtenemos los datos de la respuesta
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    // Manejo de errores
    console.error('Error fetching zones:', error.message || error);
    return NextResponse.json({ error: 'Error al obtener las zonas' }, { status: 500 });
  }
}
