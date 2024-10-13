import { NextResponse } from 'next/server';

const URL_API_AUTH = process.env.NEXT_PUBLIC_URL_API_AUTH;
const NEXT_PUBLIC_EMPRESA_ID = process.env.NEXT_PUBLIC_EMPRESA_ID

export async function POST(req) {
  const { email,otp,fingerprint} = await req.json();
  console.log({ email,otp,fingerprint})
  try {
    

    if (!email) {
      return NextResponse.json({ error: 'Correo electrónico es requerido' }, { status: 400 });
    }

    const response = await fetch(`${URL_API_AUTH}/api/trust-device/update-device`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

      },
      body: JSON.stringify({email,otpCode:otp,empresaId:NEXT_PUBLIC_EMPRESA_ID,fingerprint})
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      return NextResponse.json({ error: errorDetails.message || 'Error al enviar el correo de recuperación' }, { status: response.status });
    }
    
    const data =  await response.json();

    console.log(data)
    

    return NextResponse.json({data }, { status: 200 });
  } catch (error) {
    console.error('Error al enviar el correo de recuperación:', error);
    return NextResponse.json({ error: 'Error al enviar el correo de recuperación' }, { status: 500 });
  }
}
