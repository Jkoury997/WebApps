// /app/api/zones/route.js
import { NextResponse } from 'next/server';

const NEXT_PUBLIC_URL_API_PRESENTISMO = process.env.NEXT_PUBLIC_URL_API_PRESENTISMO;

export async function POST(req) {
  const body = await req.json();
  const { uuid, zoneId } = body;

  try {
    const response = await fetch(`${NEXT_PUBLIC_URL_API_PRESENTISMO}/api/attendance/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uuid, zoneId }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ message: data.message || 'Error al registrar asistencia' }, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error en la solicitud a la API:', error);
    return NextResponse.json({ message: error.message || 'Error en la solicitud' }, { status: 500 });
  }
}
