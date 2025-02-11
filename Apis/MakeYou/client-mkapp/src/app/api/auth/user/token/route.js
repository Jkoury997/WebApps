import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';


export async function GET(req) {
    try {

        const cookieStore = cookies();
        const accessToken = cookieStore.get("accessToken")

        if (accessToken) {
            // Guardar tokens en cookies

            return NextResponse.json(accessToken);
        } else {
            return NextResponse.json({ error: "Token no disponible" }, { status: response.status });
        }
    } catch (error) {

        return NextResponse.json({ error: error.message || 'Error during login' }, { status: 500 });
    }
}
