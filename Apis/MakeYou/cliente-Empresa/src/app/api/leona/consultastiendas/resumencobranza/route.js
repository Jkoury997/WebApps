import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const NEXT_PUBLIC_URL_API_LEONA = process.env.NEXT_PUBLIC_URL_API_LEONA;

function convertISOToDDMMYYYY(isoDate) {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses empiezan en 0, por eso sumamos 1
    const year = date.getFullYear();
    return `${year}/${month}/${day}`;
  }
  

export async function POST(req) {
    const cookieStore = cookies();
    const Token = cookieStore.get("Token");
    const {startDate,endDate} = await req.json();

    if (!Token) {
        return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

           // Enviar la solicitud al backend
           const response = await fetch(`${NEXT_PUBLIC_URL_API_LEONA}/api/ConsultasTiendas/ResumenCobranzas?Desde=${convertISOToDDMMYYYY(startDate)}&Hasta=${convertISOToDDMMYYYY(endDate)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Token': Token.value
            }
        });

        const responseData = await response.json();

    try {

        

        if (response.ok) {
            // Devolver la respuesta en caso de éxito
            return NextResponse.json(responseData);
        } else {
            // Manejo de errores específicos de la API
            return NextResponse.json({ error: responseData.Mensaje }, { status: response.status });
        }
    } catch (error) {
        // Manejo de errores generales
        return NextResponse.json({ error: error.message || 'Error during data retrieval' }, { status: 500 });
    }
}
