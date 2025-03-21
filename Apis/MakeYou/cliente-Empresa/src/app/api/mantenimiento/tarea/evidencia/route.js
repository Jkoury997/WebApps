import { NextResponse } from "next/server";

const NEXT_PUBLIC_URL_API_MANTENIMIENTO = process.env.NEXT_PUBLIC_URL_API_MANTENIMIENTO;

export async function POST(req) {
  try {

    const { searchParams } = new URL(req.url);
    const tarea = searchParams.get('tarea');

    console.log(tarea)

    if (!tarea) {
      return NextResponse.json({ error: "El ID de la tarea es requerido" }, { status: 400 });
    }

    // Leer el cuerpo de la petición como `FormData`
    const formData = await req.formData();
    const imagenes = formData.getAll("imagenes"); // Obtiene todas las imágenes

    if (!imagenes.length) {
      return NextResponse.json({ error: "Se requiere al menos una imagen" }, { status: 400 });
    }

    // Crear un nuevo FormData para reenviar al backend
    const backendFormData = new FormData();
    imagenes.forEach((imagen) => backendFormData.append("imagenes", imagen));

    // Enviar los archivos al backend de Node.js
    const response = await fetch(`${NEXT_PUBLIC_URL_API_MANTENIMIENTO}/api/tareas/${tarea}/evidencia`, {
      method: "POST",
      body: backendFormData,
    });

    // Leer la respuesta del backend
    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.error || "Error al enviar imágenes al backend" },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData, { status: 201 });

  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
