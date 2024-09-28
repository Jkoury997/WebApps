
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const NEXT_PUBLIC_URL_API_MANITAS = process.env.NEXT_PUBLIC_URL_API_MANITAS;

// Manejar el método GET para obtener una empresa por ID
export async function GET(req) {
    revalidatePath("/")
    try {
        // Obtener el query parameter 'id' desde la UR
        // Enviar la solicitud al backend para obtener la empresa por su ID
        const response = await fetch(`${NEXT_PUBLIC_URL_API_MANITAS}/api/empresas/listar`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },


        });

        // Obtener los datos de la respuesta
        const responseData = await response.json();

        // Verificar si la solicitud fue exitosa
        if (response.ok) {
            return NextResponse.json(responseData);
        } else {
            return NextResponse.json({ error: responseData.Mensaje || 'Error en la solicitud' }, { status: response.status });
        }
    } catch (error) {
        // Manejo de errores generales
        return NextResponse.json({ error: error.message || 'Error during request' }, { status: 500 });
    }
}
