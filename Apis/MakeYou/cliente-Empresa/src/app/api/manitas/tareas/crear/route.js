import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const NEXT_PUBLIC_URL_API_MANITAS = process.env.NEXT_PUBLIC_URL_API_MANITAS;
const NEXT_PUBLIC_EMPRESA_ID_MANITAS = process.env.NEXT_PUBLIC_EMPRESA_ID_MANITAS;

export async function POST(req) {
    try {
        const formData = await req.formData(); // Cambia req.json() por req.formData()
        const cookieStore = cookies();
        const user = cookieStore.get("User");

        const empresa = NEXT_PUBLIC_EMPRESA_ID_MANITAS;

        // Obtener los campos de FormData
        const titulo = formData.get('titulo');
        const descripcion = formData.get('descripcion');
        const categoria = formData.get('categoria');
        const lugar = formData.get('lugar');
        const urgencia = formData.get('urgencia'); // Aquí está la imagen
        const imagenAntes = formData.get('imagenAntes'); // Aquí está la imagen

        // Verifica que todos los campos necesarios existan
        if (!titulo || !descripcion || !categoria || !lugar || !urgencia ||!imagenAntes) {
            return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });
        }

        // Preparamos el FormData para enviar al backend
        const formDataToSend = new FormData();
        formDataToSend.append('titulo', titulo);
        formDataToSend.append('descripcion', descripcion);
        formDataToSend.append('categoria', categoria);
        formDataToSend.append('lugar', lugar);
        formDataToSend.append('empresa', empresa);
        formDataToSend.append('urgencia', urgencia);
        formDataToSend.append('creadoPor', user.value);
        formDataToSend.append('imagenAntes', imagenAntes); // Añadimos la imagen
        console.log(formDataToSend)
        // Enviar la solicitud de creación de tarea al backend
        const response = await fetch(`${NEXT_PUBLIC_URL_API_MANITAS}/api/tareas`, {
            method: 'POST',
            body: formDataToSend, // Enviamos el FormData completo, incluyendo la imagen
        });

        const responseData = await response.json();
        
        if (response.ok) {
            // Retorna la respuesta en caso de éxito
            return NextResponse.json(responseData);
        } else {
            // Manejo de errores específicos de la API
            return NextResponse.json({ error: responseData.Mensaje || 'Error en la solicitud' }, { status: response.status });
        }
    } catch (error) {
        // Manejo de errores generales
        return NextResponse.json({ error: error.message || 'Error durante la solicitud' }, { status: 500 });
    }
}
