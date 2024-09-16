import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const URL_API_PRESENTISMO = process.env.NEXT_PUBLIC_URL_API_PRESENTISMO;

export async function GET(req) {
    try {
        const cookieStore = cookies();
        const deviceUUIDCookie = cookieStore.get("deviceUUID");
        const useruuidCookie = cookieStore.get("useruuid");
        const tokenCookie = cookieStore.get('accessToken');

        if (!deviceUUIDCookie || !useruuidCookie) {
            return NextResponse.json({ error: 'Este dispositivo no está verificado para generar el código QR.' }, { status: 400 });
        }

        const deviceUUID = deviceUUIDCookie.value;
        const useruuid = useruuidCookie.value;
        const token = tokenCookie?.value;

        if (!token) {
            return NextResponse.json({ error: 'Access token not found in cookies' }, { status: 401 });
        }

        // Enviar la solicitud de generación de QR al backend
        const response = await fetch(`${URL_API_PRESENTISMO}/api/qr/generate-qr`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ useruuid: useruuid, deviceUUID: deviceUUID })
        });

        const responseData = await response.json();

        if (response.ok) {
            return NextResponse.json(responseData, { status: 201 });
        } else if (response.status === 403) {
            return NextResponse.json({ error: 'Este dispositivo no está verificado para generar el código QR.' }, { status: 403 });
        } else {
            return NextResponse.json({ error: responseData.error || 'Error generating QR code' }, { status: response.status });
        }
    } catch (error) {
        console.error('Error during QR generation:', error);
        return NextResponse.json({ error: error.message || 'Error during QR generation' }, { status: 500 });
    }
}
