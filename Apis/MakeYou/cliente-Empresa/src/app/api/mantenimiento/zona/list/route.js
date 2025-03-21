import { NextResponse } from "next/server";

const NEXT_PUBLIC_URL_API_MANTENIMIENTO = process.env.NEXT_PUBLIC_URL_API_MANTENIMIENTO;
const NEXT_PUBLIC_EMPRESA_ID_MANTENIMIENTO = process.env.NEXT_PUBLIC_EMPRESA_ID_MANTENIMIENTO;

export async function GET(req) {
  try {
    if (!NEXT_PUBLIC_URL_API_MANTENIMIENTO) {
      throw new Error("API URL is not defined");
    }

    const response = await fetch(`${NEXT_PUBLIC_URL_API_MANTENIMIENTO}/api/zonas/empresa/${NEXT_PUBLIC_EMPRESA_ID_MANTENIMIENTO}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store", // Indica a Next.js que no almacene en caché la respuesta
    });

    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.error || "Error en la respuesta de la API" },
        { status: response.status },
        { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" } }
      );
    }

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });

  } catch (error) {
    console.error("Error en la API de Next.js:", error);
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate" } }
    );
  }
}
