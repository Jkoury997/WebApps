import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const URL_API_PRESENTISMO = process.env.NEXT_PUBLIC_URL_API_PRESENTISMO;

export async function GET(req) {
    try {
        const cookieStore = cookies();
        const fingerprint = cookieStore.get("fingerprint");
        const userId = cookieStore.get("userId");

        if (!fingerprint || !userId) {
            return NextResponse.json({ error: 'Este dispositivo no está verificado para generar el código QR.' }, { status: 400 });
        }


        // Enviar la solicitud de generación de QR al backend
        const response = await fetch(`${URL_API_PRESENTISMO}/api/qr/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId.value,fingerprint: fingerprint.value})
        });

        const responseData = await response.json();
        console.log(responseData)

        if (response.ok) {
            return NextResponse.json(responseData, { status: 201 });
        } else {
            return NextResponse.json({ error: responseData.message || 'Error generating QR code' }, { status: response.status });
        }
    } catch (error) {
        console.error('Error during QR generation:', error);
        return NextResponse.json({ error: error.message || 'Error during QR generation' }, { status: 500 });
    }
}
