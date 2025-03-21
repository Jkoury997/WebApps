import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';


const URL_API_AUTH = process.env.NEXT_PUBLIC_URL_API_AUTH;

export async function GET(req) {
    const cookieStore = cookies();
    const userId = cookieStore.get("userId");


  try {
    const response = await fetch(`${URL_API_AUTH}/api/user/${userId.value}`, {
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
