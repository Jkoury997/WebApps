// app/api/generate-pdf/route.js

import { NextResponse } from 'next/server';
import PDFDocument from 'pdfkit';
import { createCanvas } from 'canvas';
import QRCode from 'qrcode';

export async function POST(req) {
  //const { qrData, apiResponse } = await req.json();
  

  const qrData = 'https://example.com';
  const apiResponse = {
    Articulo: {
      DescDetalle: 'Rojo',
      DescMedida: '30x30 cm',
      Descripcion: 'Descripción del artículo',
    },
  };

  const doc = new PDFDocument();
  let buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {
    let pdfData = Buffer.concat(buffers);
    return NextResponse.json(pdfData, {
      headers: {
        'Content-Length': Buffer.byteLength(pdfData),
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=qr_code.pdf',
      },
    });
  });

  doc.fontSize(18).text('Detalles del Artículo', { align: 'center' });

  if (apiResponse) {
    doc.fontSize(14).text(`Color: ${apiResponse.Articulo.DescDetalle || 'N/A'}`);
    doc.fontSize(14).text(`Medida: ${apiResponse.Articulo.DescMedida || 'N/A'}`);
    doc.fontSize(14).text(`Descripción: ${apiResponse.Articulo.Descripcion || 'N/A'}`);
  }

  const canvas = createCanvas(256, 256);
  QRCode.toCanvas(canvas, qrData, { width: 256 }, (error) => {
    if (error) throw error;
    const qrImage = canvas.toDataURL('image/png');
    doc.image(qrImage, {
      fit: [256, 256],
      align: 'center',
      valign: 'center',
    });
    doc.end();
  });
}
