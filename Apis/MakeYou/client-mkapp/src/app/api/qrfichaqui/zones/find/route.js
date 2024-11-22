// /app/api/zones/route.js
import { NextResponse } from 'next/server';

export async function GET(req) {
  // Obtener los parámetros de la URL
  const url = req.nextUrl;
  const trustdevice = url.searchParams.get('trustdevice');

  if (!trustdevice) {
    return NextResponse.json({ error: 'trustdevice is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API_PRESENTISMO}/api/zones/trustdevice/${trustdevice}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error en la respuesta del servidor:', errorData);
      return NextResponse.json({ error: errorData.message || 'Error en la respuesta del servidor' }, { status: response.status });
    }

    const data = await response.json();

    // Verificar que los datos sean válidos
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No se encontraron datos para el trustdevice proporcionado' }, { status: 404 });
    }

    console.log('Datos obtenidos:', data);
    return NextResponse.json(data, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching zones:', error);
    return NextResponse.json({ error: 'Error fetching zones' }, { status: 500 });
  }
}
