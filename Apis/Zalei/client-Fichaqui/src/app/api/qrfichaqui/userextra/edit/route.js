import { NextResponse } from 'next/server';

const URL_API_PRESENTISMO = process.env.NEXT_PUBLIC_URL_API_PRESENTISMO;

export async function POST(req) {
    const { workGroupId, _id } = await req.json(); 

    try {
        // Obtener los datos del cuerpo de la solicitud

        // Enviar la solicitud de actualización de usuario al backend
        const response = await fetch(`${URL_API_PRESENTISMO}/api/user-extra/${_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({workGroupId})
        });

        const responseData = await response.json();

        console.log(responseData)

        if (response.ok) {
            return NextResponse.json(responseData);
        } else {
            // Retornar el error si la solicitud al backend falló
            return NextResponse.json({ error: responseData.message }, { status: response.status });
        }
    } catch (error) {
        // Manejo de errores generales
        return NextResponse.json({ error: error.message || 'Error during edit' }, { status: 500 });
    }
}
