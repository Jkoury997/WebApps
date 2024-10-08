// pages/api/tareas/[id]/completar/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const NEXT_PUBLIC_URL_API_MANITAS = process.env.NEXT_PUBLIC_URL_API_MANITAS;
const NEXT_PUBLIC_EMPRESA_ID_MANITAS = process.env.NEXT_PUBLIC_EMPRESA_ID_MANITAS;



export async function POST(req) {

    console.log("Hola")
    try {



        const formData = await req.formData(); // Obtén los datos del formulario (incluida la imagen)
        const cookieStore = cookies();
        const user = cookieStore.get("User");
        const empresa = NEXT_PUBLIC_EMPRESA_ID_MANITAS;
        

        const { searchParams } = new URL(req.url);
        const tareaId = searchParams.get('tareaId'); 

        // Obtener los campos de FormData
        const imagenDespues = formData.get('imagenDespues'); // Imagen de después
        const nota = formData.get('nota'); // Nota opcional de la tarea

        // Verifica que los campos necesarios existan
        if (!imagenDespues || !nota) {
            return NextResponse.json({ error: 'La imagen y la nota son obligatorias' }, { status: 400 });
        }

        // Preparamos el FormData para enviar al backend
        const formDataToSend = new FormData();
        
        formDataToSend.append('nota', nota);
        formDataToSend.append('empresa', empresa);
        formDataToSend.append('realizadoPor', user?.value || 'anonimo');
        formDataToSend.append('imagenDespues', imagenDespues);

        console.log(formDataToSend)

        // Enviar la solicitud de completar la tarea al backend
        const response = await fetch(`${NEXT_PUBLIC_URL_API_MANITAS}/api/tareas/completar/${tareaId}`, {
            method: 'POST',
            body: formDataToSend, // Enviar el FormData completo
        });

        const responseData = await response.json();

        if (response.ok) {
            // Retornar la respuesta en caso de éxito
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
