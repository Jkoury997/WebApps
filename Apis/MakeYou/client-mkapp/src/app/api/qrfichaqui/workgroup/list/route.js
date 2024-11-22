import { NextResponse } from 'next/server';
const URL_API_PRESENTISMO = process.env.NEXT_PUBLIC_URL_API_PRESENTISMO;

const NEXT_PUBLIC_EMPRESA_ID = process.env.NEXT_PUBLIC_EMPRESA_ID
export async function GET(req) {

    try {
        const response = await fetch(`${URL_API_PRESENTISMO}/api/work-group/empresa/${NEXT_PUBLIC_EMPRESA_ID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          return NextResponse.json({ message: data.message || 'Error al obtener workGroup' }, { status: response.status });
        }
    
        return NextResponse.json(data, { status: 200 });
      } catch (error) {
        console.error('Error al obtener workGroup:', error);
        return NextResponse.json({ message: 'Error al obtener workGroup' }, { status: 500 });
      }
  }