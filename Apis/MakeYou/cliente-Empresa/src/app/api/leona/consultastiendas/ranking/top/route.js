import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const URL_API_LEONA = process.env.NEXT_PUBLIC_URL_API_LEONA; // Definir la URL de la API

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
    const rubro = searchParams.get("rubro"); // Opcional
    const shop = searchParams.get("store"); // Opcional

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required parameters: from and to" },
        { status: 400 }
      );
    }

    // Construcción de la URL con parámetros opcionales
    let apiUrl = `${URL_API_LEONA}/api/ConsultasTiendas/Ranking?Desde=${startDate}&Hasta=${endDate}`;

    if (rubro) {
      apiUrl += `&Rubro=${rubro}`;
    }

    if (shop) {
      apiUrl += `&Shop=${shop}`;
    }

    // Llamada a la API
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
