import { NextResponse } from 'next/server';

const URL_API_AUTH = process.env.NEXT_PUBLIC_URL_API_AUTH;

export async function POST(req) {
    try {
        const { deviceUUID, refreshToken } = await req.json();
        const cookieStore = cookies();

        if (!deviceUUID || !refreshToken) {
            return NextResponse.json({ message: 'Faltan parámetros requeridos' }, { status: 400 });
        }

        // Consulta a tu API de autenticación para validar el refreshToken
        const authResponse = await fetch(`${URL_API_AUTH}/api/token/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: refreshToken}),
        });

        const authData = await authResponse.json();

        if (!authResponse.ok) {
            return NextResponse.json({ message: 'Refresh token inválido' }, { status: 401 });
        }

        if (authResponse.ok) {
            // Guardar tokens en cookies
            cookieStore.set('accessToken', authData.accessToken, { path: '/' });

            return NextResponse.json({authData},{ status: 200 });
        } else {
            console.log(authData.error)
            return NextResponse.json({ error: authData.error }, { status: authResponse.status });
        }

    } catch (error) {
        return NextResponse.json({ error: error.message || 'Error durante la verificación de inicio de sesión' }, { status: 500 });
    }
}
