// /app/api/zones/route.js
import { NextResponse } from 'next/server';

const NEXT_PUBLIC_URL_API_PRESENTISMO = process.env.NEXT_PUBLIC_URL_API_PRESENTISMO
const NEXT_PUBLIC_EMPRESA_ID = process.env.NEXT_PUBLIC_EMPRESA_ID

export async function POST(req) {
    const body = await req.json();
    const { nombre} = body

    try {
        const response = await fetch(`${NEXT_PUBLIC_URL_API_PRESENTISMO}/api/zones`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nombre, empresaId: NEXT_PUBLIC_EMPRESA_ID }),
        });
  
        const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching zones:', error);
    return NextResponse.json({ error: 'Error fetching zones' }, { status: 500 });
  }
}