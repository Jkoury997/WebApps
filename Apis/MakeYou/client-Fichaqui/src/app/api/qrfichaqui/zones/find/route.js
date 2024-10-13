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
    });
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching zones:', error);
    return NextResponse.json({ error: 'Error fetching zones' }, { status: 500 });
  }
}
