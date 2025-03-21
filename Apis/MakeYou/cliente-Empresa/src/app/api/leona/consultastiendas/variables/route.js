import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const URL_API_LEONA = process.env.NEXT_PUBLIC_URL_API_LEONA; // Si es solo backend, usa process.env.URL_API_LEONA

export async function GET(req) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("Token");

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    // Obtener parámetros de la URL
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("from");
    const endDate = searchParams.get("to");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required parameters: from and to" },
        { status: 400 }
      );
    }

    // Construcción de la URL con las fechas convertidas
    const apiUrl = `${URL_API_LEONA}/api/ConsultasTiendas/Variables?Desde=${
      startDate
    }&Hasta=${endDate}`;

    // Realizar la consulta a la API
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Token: token.value,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.Mensaje || "API error" },
        { status: response.status }
      );
    }

    // Respuesta exitosa
    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
