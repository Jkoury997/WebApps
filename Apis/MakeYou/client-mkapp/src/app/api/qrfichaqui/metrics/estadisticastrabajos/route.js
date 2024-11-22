import { NextResponse } from 'next/server';
const URL_API_PRESENTISMO = process.env.NEXT_PUBLIC_URL_API_PRESENTISMO;
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const fechaInicio = searchParams.get('fechaInicio');
    const fechaFin = searchParams.get('fechaFin');
    const userId = searchParams.get('userId');

    console.log(fechaFin)
  
    try {
        const response = await fetch(`${URL_API_PRESENTISMO}/api/metrics/estadisticas-trabajo?userId=${userId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          return NextResponse.json({ message: data.message || 'Error al obtener estadisticas trabajo' }, { status: response.status });
        }
    
        return NextResponse.json(data, { status: 200 });
      } catch (error) {
        console.error('Error al obtener estadisticas trabajo:', error);
        return NextResponse.json({ message: 'Error al obtener estadisticas trabajo' }, { status: 500 });
      }
  }