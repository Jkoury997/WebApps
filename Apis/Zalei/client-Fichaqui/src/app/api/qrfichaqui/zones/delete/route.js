import { NextResponse } from 'next/server';

const NEXT_PUBLIC_URL_API_PRESENTISMO = process.env.NEXT_PUBLIC_URL_API_PRESENTISMO;

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
  
    if (!id) {
      return NextResponse.json({ error: 'ID de zona no proporcionado' }, { status: 400 });
    }
  
    try {
      // Realizamos la solicitud para eliminar la zona
      const response = await fetch(`${NEXT_PUBLIC_URL_API_PRESENTISMO}/api/zones/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        console.error('Error al eliminar la zona:', response.statusText);
        return NextResponse.json({ error: 'Error eliminando la zona' }, { status: response.status });
      }
  
      return NextResponse.json({ message: 'Zona eliminada correctamente' }, { status: 200 });
    } catch (error) {
      console.error('Error eliminando la zona:', error.message || error);
      return NextResponse.json({ error: 'Error al eliminar la zona' }, { status: 500 });
    }
  }