import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Button } from '../ui/button';
import { Printer } from 'lucide-react';
import printJS from 'print-js';

export default function QrPrinter({ qrData, apiResponse }) {
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Este efecto se ejecuta solo en el cliente, no en el servidor
    setIsClient(true);
  }, []);

  const handlePrint = () => {
    if (!isClient) return;

    setLoading(true);

    // Si qrData es un string JSON, lo analizamos; si es un objeto, lo usamos directamente
    const qrDataJson = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;

    // Generar la imagen del código QR como Data URL
    const qrCanvas = document.querySelector('#qr-canvas canvas');
    const qrImageData = qrCanvas.toDataURL('image/png');

    // Crear el contenido HTML que se imprimirá
    const printContent = `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
          }
          .page {
            width: 210mm;
            height: 297mm;
            padding: 20mm;
            box-sizing: border-box;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .importantData {
            font-size: 25px;
            font-weight: bold;
          }
          .section {
            display: flex;
            justify-content: space-between;
          }
          .section2 {
            display: flex;
            justify-content: space-between;
            margin-top: 400px;
          }
          .details {
            width: 60%;
            font-size: 14px;
            line-height: 1.6;
            color: #555;
            text-align: left;
          }
          .details p {
            margin: 0;
            padding: 4px 0;
          }
          .qr-code {
            width: 50%;
            text-align: right;
          }
          .qr-code img {
            padding: 10px;
            border: 2px solid #333;
            border-radius: 10px;
          }
          h3 {
            margin: 0;
            padding: 0;
            font-size: 24px;
            color: #333;
            border-bottom: 2px solid #ccc;
            padding-bottom: 10px;
            margin-bottom: 20px;
            text-align: left;
          }
          .transformRotate {
            transform: scaleX(-1) scaleY(-1);
          }
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .page {
              border: none;
              box-shadow: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="section">
            <div class="details">
              ${qrDataJson.Fecha ? `<h3>Zalei S.A. - Fecha: ${qrDataJson.Fecha}</h3>` : ''}
              ${qrDataJson.Cantidad ? `<p class="importantData">Cantidad: ${qrDataJson.Cantidad}</p>` : ''}
              ${apiResponse.Articulo.DescDetalle ? `<p>Color: ${apiResponse.Articulo.DescDetalle}</p>` : ''}
              ${apiResponse.Articulo.DescMedida ? `<p>Medida: ${apiResponse.Articulo.DescMedida}</p>` : ''}
              ${apiResponse.Articulo.Descripcion ? `<p>Descripción: ${apiResponse.Articulo.Descripcion}</p>` : ''}
              ${qrDataJson.Galpon ? `<p>Galpón: ${qrDataJson.Galpon}</p>` : ''}
            </div>
            <div class="qr-code">
              <img src="${qrImageData}" style="margin: 20px; width: 200px; height: 200px;" />
            </div>
          </div>
          <div class="section2 transformRotate">
            <div class="details">
              ${qrDataJson.Fecha ? `<h3>Zalei S.A. - Fecha: ${qrDataJson.Fecha}</h3>` : ''}
              ${qrDataJson.Cantidad ? `<p class="importantData">Cantidad: ${qrDataJson.Cantidad}</p>` : ''}
              ${apiResponse.Articulo.DescDetalle ? `<p>Color: ${apiResponse.Articulo.DescDetalle}</p>` : ''}
              ${apiResponse.Articulo.DescMedida ? `<p>Medida: ${apiResponse.Articulo.DescMedida}</p>` : ''}
              ${apiResponse.Articulo.Descripcion ? `<p>Descripción: ${apiResponse.Articulo.Descripcion}</p>` : ''}
              ${qrDataJson.Galpon ? `<p>Galpón: ${qrDataJson.Galpon}</p>` : ''}
            </div>
            <div class="qr-code">
              <img src="${qrImageData}" style="margin: 20px; width: 200px; height: 200px;" />
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Usar PrintJS para imprimir el contenido
    printJS({
      printable: printContent,
      type: 'raw-html',
      targetStyles: ['*'],  // Incluir todos los estilos en la impresión
    });

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div id="qr-canvas" className="m-3">
        <QRCode value={qrData} size={200} />
      </div>
      <Button onClick={handlePrint} className="flex items-center justify-center mt-4 p-2 rounded" disabled={loading}>
        <Printer className="mr-2" />
        {loading ? 'Generando...' : 'Imprimir QR'}
      </Button>
    </div>
  );
}
