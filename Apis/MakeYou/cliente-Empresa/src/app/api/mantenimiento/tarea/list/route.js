import { NextResponse } from "next/server";

const NEXT_PUBLIC_URL_API_MANTENIMIENTO = process.env.NEXT_PUBLIC_URL_API_MANTENIMIENTO;

export async function GET(req) {
  try {

        // Obtener el parámetro `tienda` desde el query de la URL
        const { searchParams } = new URL(req.url);
        const zona = searchParams.get('zona');

    // Verificar que la URL de la API esté definida
    if (!NEXT_PUBLIC_URL_API_MANTENIMIENTO) {
      throw new Error("API URL is not defined");
    }

    // Enviar la solicitud al backend de Node.js
    const response = await fetch(`${NEXT_PUBLIC_URL_API_MANTENIMIENTO}/api/tareas/empresa/${zona}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    });

    // Manejar la respuesta del backend
    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.error || "Error en la respuesta de la API" },
        { status: response.status }
      );
    }

    return NextResponse.json(responseData, { status: 201 }); // 201: Creado con éxito

  } catch (error) {
    console.error("Error en la API de Next.js:", error);
    return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
  }
}
