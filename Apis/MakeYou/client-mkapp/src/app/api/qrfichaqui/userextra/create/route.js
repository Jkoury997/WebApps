import { NextResponse } from 'next/server';
const URL_API_PRESENTISMO = process.env.NEXT_PUBLIC_URL_API_PRESENTISMO;
export async function POST(req) {

    const { workGroupId,userId} = await req.json(); 
  
    try {
        const response = await fetch(`${URL_API_PRESENTISMO}/api/user-extra/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
            body: JSON.stringify({userId:userId,workGroupId:workGroupId})

        });
    
        const data = await response.json();
    
        if (!response.ok) {
          return NextResponse.json({ message: data.message || 'Error al obtener infomracion extra' }, { status: response.status });
        }
    
        return NextResponse.json(data, { status: 200 });
      } catch (error) {
        console.error('Error al obtener infomracion extra:', error);
        return NextResponse.json({ message: 'Error al obtener infomracion extra' }, { status: 500 });
      }
  }