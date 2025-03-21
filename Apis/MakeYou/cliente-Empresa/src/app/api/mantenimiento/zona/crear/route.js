import { NextResponse } from "next/server";

const NEXT_PUBLIC_URL_API_MANTENIMIENTO = process.env.NEXT_PUBLIC_URL_API_MANTENIMIENTO;
const NEXT_PUBLIC_EMPRESA_ID_MANTENIMIENTO = process.env.NEXT_PUBLIC_EMPRESA_ID_MANTENIMIENTO

export async function POST(req) {
  try {

    // Verificar que la URL de la API esté definida
    if (!NEXT_PUBLIC_URL_API_MANTENIMIENTO) {
      throw new Error("API URL is not defined");
    }

    // Obtener el cuerpo de la solicitud
    const body = await req.json();
 
    const { nombre} = body;

    // Validar que los datos requeridos estén presentes
    if (!nombre) {
      return NextResponse.json({ error: "Faltan datos requeridos: nombre" }, { status: 400 });
    }

    // Enviar la solicitud al backend de Node.js
    const response = await fetch(`${NEXT_PUBLIC_URL_API_MANTENIMIENTO}/api/zonas`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, empresa:NEXT_PUBLIC_EMPRESA_ID_MANTENIMIENTO}),
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
