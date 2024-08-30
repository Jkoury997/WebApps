import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';
import { Button } from '../ui/button';
import { Printer } from 'lucide-react';

export default function QrPrinter({ qrData, apiResponse }) {
  const [loading, setLoading] = useState(false);

  const printContent = () => {
    setLoading(true);

    // Verificar el contenido original de qrData
    console.log("Original qrData:", qrData);

    // Si qrData ya es un string JSON, lo analizamos; si es un objeto, lo usamos directamente
    const qrDataJson = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;

    // Verificar el resultado final que usarás
    console.log("qrData as JSON object:", qrDataJson);

    try {
      // Crear contenido HTML para imprimir
      const printHtml = `
        <html>
        <head>
          <title>QR Print</title>
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
            .importantData{
              font-size: 25px; /* Aquí puedes ajustar el tamaño según lo necesites */
              font-weight: bold; /* Opcional: para hacer que el texto sea más prominente */
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
            .transformRotate{
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
                <img src="${document.querySelector('#qr-canvas canvas').toDataURL('image/png')}" style="margin: 20px; width: 200px; height: 200px;" />
              </div>
            </div>
            <div class="section2">
              <div class="details transformRotate">
                ${qrDataJson.Fecha ? `<h3>Zalei S.A. - Fecha: ${qrDataJson.Fecha}</h3>` : ''}
                ${qrDataJson.Cantidad ? `<p class="importantData">Cantidad: ${qrDataJson.Cantidad}</p>` : ''}
                ${apiResponse.Articulo.DescDetalle ? `<p>Color: ${apiResponse.Articulo.DescDetalle}</p>` : ''}
                ${apiResponse.Articulo.DescMedida ? `<p>Medida: ${apiResponse.Articulo.DescMedida}</p>` : ''}
                ${apiResponse.Articulo.Descripcion ? `<p>Descripción: ${apiResponse.Articulo.Descripcion}</p>` : ''}
                ${qrDataJson.Galpon ? `<p>Galpón: ${qrDataJson.Galpon}</p>` : ''}
              </div>
              <div class="qr-code">
                <img src="${document.querySelector('#qr-canvas canvas').toDataURL('image/png')}" style="margin: 20px; width: 200px; height: 200px;" />
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Crear un nuevo contenedor de impresión en el DOM
      const printContainer = document.createElement('div');
      printContainer.innerHTML = printHtml;
      document.body.appendChild(printContainer);

      // Imprimir el contenido
      window.print();

      // Eliminar el contenido de impresión después de imprimir
      document.body.removeChild(printContainer);

      setLoading(false);
    } catch (error) {
      console.error('Error printing content:', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div id="qr-canvas" className="m-3">
        <QRCode value={qrData} size={200}/>
      </div>
      <Button onClick={printContent} className="flex items-center justify-center mt-4 p-2 rounded" disabled={loading}>
        <Printer className="mr-2" />
        {loading ? 'Generando...' : 'Imprimir QR'}
      </Button>
    </div>
  );
}
