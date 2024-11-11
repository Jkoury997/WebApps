import { NextResponse } from 'next/server';


const URL_API_AUTH = process.env.NEXT_PUBLIC_URL_API_AUTH;
const NEXT_PUBLIC_EMPRESA_ID = process.env.NEXT_PUBLIC_EMPRESA_ID

export async function GET(req) {
    const url = req.nextUrl;
  const userId = url.searchParams.get('userId');

  try {
    const response = await fetch(`${URL_API_AUTH}/api/user/empresa/${NEXT_PUBLIC_EMPRESA_ID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ message: data.message || 'Error al obtener el usuario' }, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ message: 'Error al obtener los datos del usuario' }, { status: 500 });
  }
}


