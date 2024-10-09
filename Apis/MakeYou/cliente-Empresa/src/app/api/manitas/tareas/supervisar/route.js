import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const NEXT_PUBLIC_URL_API_MANITAS = process.env.NEXT_PUBLIC_URL_API_MANITAS

export async function POST(req) {
    try {
      const formData = await req.formData(); // Obtener los datos del formulario (incluida la imagen)
      const cookieStore = cookies();
      const user = cookieStore.get("User");
  
      const { searchParams } = new URL(req.url);
      const tareaId = searchParams.get('tareaId');
  
      const supervisionAprobada = formData.get("supervisionAprobada");
  
      // Preparamos el FormData para enviar al backend
      const formDataToSend = new FormData();
      formDataToSend.append('supervisadoPor', user?.value || 'anonimo');
  
      if (supervisionAprobada === "true") {
        formDataToSend.append('supervisionAprobada', 'true'); // Enviar como string
      } else {
        const imagenSupervision = formData.get('imagenSupervision');
        const motivoRechazo = formData.get('motivoRechazo');
  
        if (!imagenSupervision || !motivoRechazo) {
          return NextResponse.json({ error: 'La imagen y el motivo de rechazo son obligatorios' }, { status: 400 });
        }
  
        formDataToSend.append('supervisionAprobada', 'false'); // Enviar como string
        formDataToSend.append('motivoRechazo', motivoRechazo);
        formDataToSend.append('imagenSupervision', imagenSupervision); // Imagen desde el FormData
      }

      console.log(formDataToSend)
  
      // Enviar el FormData al backend
      const response = await fetch(`${NEXT_PUBLIC_URL_API_MANITAS}/api/tareas/supervisar/${tareaId}`, {
        method: 'POST',
        body: formDataToSend, // No configurar Content-Type manualmente, el navegador lo hace
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        return NextResponse.json(responseData);
      } else {
        return NextResponse.json({ error: responseData.Mensaje || 'Error en la solicitud' }, { status: response.status });
      }
    } catch (error) {
      return NextResponse.json({ error: error.message || 'Error durante la solicitud' }, { status: 500 });
    }
  }
  