// pages/api/register.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const URL_API_AUTH = process.env.NEXT_PUBLIC_URL_API_AUTH;
const NEXT_PUBLIC_EMPRESA_ID = process.env.NEXT_PUBLIC_EMPRESA_ID

export async function POST(req) {
    try {
        const body = await req.json();
        const { firstName, lastName, dni, email, password,sex } = body;
        const cookieStore = cookies();

        // Enviar la solicitud de registro al backend
        const response = await fetch(`${URL_API_AUTH}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName, dni, email, password,sex,empresa:NEXT_PUBLIC_EMPRESA_ID })
        });

        const responseData = await response.json();

        if (response.ok) {
            cookieStore.set('userId', responseData.user._id, {
                path: '/'

            });
            return NextResponse.json(responseData, { status: 201 });
        } else {
            return NextResponse.json({ error: responseData.message }, { status: response.status });
        }
    } catch (error) {
        console.error('Error during registration:', error);
        return NextResponse.json({ error: error.message || 'Error during registration' }, { status: 500 });
    }
}
