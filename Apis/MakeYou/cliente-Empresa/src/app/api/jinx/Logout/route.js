import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = cookies();
    try {
        

        // Eliminación de cookies
        cookieStore.set('AccessKey', '', { path: '/', expires: new Date(0) });
        cookieStore.set('Token', '', { path: '/', expires: new Date(0) });

        return NextResponse.json({ success: true });
    } catch (error) {
        // Manejo de errores generales y eliminación de cookies si ocurre un error
        try {

            cookieStore.set('AccessKey', '', { path: '/', expires: new Date(0) });
            cookieStore.set('Token', '', { path: '/', expires: new Date(0) });
            cookieStore.set('User', '', { path: '/', expires: new Date(0) });
        } catch (innerError) {
            console.error('Error al eliminar cookies:', innerError);
        }

        return NextResponse.json({ error: error.message || 'Error during cookie deletion' }, { status: 500 });
    }
}
