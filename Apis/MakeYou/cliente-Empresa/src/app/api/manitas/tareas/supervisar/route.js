import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const NEXT_PUBLIC_URL_API_MANITAS = process.env.NEXT_PUBLIC_URL_API_MANITAS;

export async function POST(req) {
  try {
    const formData = await req.formData();
    const cookieStore = cookies();
    const user = cookieStore.get("User");

    const { searchParams } = new URL(req.url);
    const tareaId = searchParams.get('tareaId');

    const supervisionAprobada = formData.get("supervisionAprobada") === 'true'; // Convertir a booleano
    const formDataToSend = new FormData();

    formDataToSend.append('supervisadoPor', user?.value || 'anonimo');

    if (supervisionAprobada) {
      formDataToSend.append('supervisionAprobada', 'true');
    } else {
      const imagenSupervision = formData.get('imagenSupervision');
      const motivoRechazo = formData.get('motivoRechazo');

      if (!imagenSupervision || !motivoRechazo) {
        return NextResponse.json({ error: 'La imagen y el motivo de rechazo son obligatorios' }, { status: 400 });
      }

      formDataToSend.append('supervisionAprobada', 'false');
      formDataToSend.append('motivoRechazo', motivoRechazo);
      formDataToSend.append('imagenSupervision', imagenSupervision);
    }

    const response = await fetch(`${NEXT_PUBLIC_URL_API_MANITAS}/api/tareas/supervisar/${tareaId}`, {
      method: 'POST',
      body: formDataToSend,
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
