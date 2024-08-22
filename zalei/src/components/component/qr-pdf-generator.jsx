import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';
import { Button } from '../ui/button';
import { Printer } from 'lucide-react';

export default function QrPrinter({ qrData, apiResponse }) {
  const [loading, setLoading] = useState(false);
  const printRef = useRef();

  const printContent = () => {
    setLoading(true);

    // Verificar el contenido original de qrData
    console.log("Original qrData:", qrData);

    // Si qrData ya es un string JSON, lo analizamos; si es un objeto, lo usamos directamente
    const qrDataJson = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;

    // Verificar el resultado final que usarás
    console.log("qrData as JSON object:", qrDataJson);

    try {
      const printWindow = window.open('', '_blank');
      const qrCanvas = document.querySelector('#qr-canvas canvas');
      const qrImageData = qrCanvas.toDataURL('image/png');
      const qrImgElement = `<img src="${qrImageData}" style="margin: 20px; width: 200px; height: 200px;" />`;

      printWindow.document.write('<html><head><title>QR Print</title>');
      printWindow.document.write(`
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
          .section {
            display: flex;
            justify-content: space-between;
          }
          .section2 {
            display: flex;
            justify-content: space-between;
            margin-top: 300px;
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
            width: 35%;
            text-align: right;
          }
          .qr-code img {
            border: 4px solid #333;
            border-radius: 4px;
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
      `);
      printWindow.document.write('</head><body>');
      printWindow.document.write('<div class="page">');

      // Primera Sección
      printWindow.document.write('<div class="section">');
      printWindow.document.write('<div class="details">');
      printWindow.document.write('<h3>Zalei Agropecuaria</h3>');
      if (qrDataJson.Fecha) {
        printWindow.document.write(`<p>Fecha: ${qrDataJson.Fecha}</p>`);
      }
      if (apiResponse.Articulo.DescDetalle) {
        printWindow.document.write(`<p>Color: ${apiResponse.Articulo.DescDetalle}</p>`);
      }
      if (apiResponse.Articulo.DescMedida) {
        printWindow.document.write(`<p>Medida: ${apiResponse.Articulo.DescMedida}</p>`);
      }
      if (apiResponse.Articulo.Descripcion) {
        printWindow.document.write(`<p>Descripción: ${apiResponse.Articulo.Descripcion}</p>`);
      }
      if (qrDataJson.Galpon) {
        printWindow.document.write(`<p>Galpón: ${qrDataJson.Galpon}</p>`);
      }
      printWindow.document.write('</div>');
      printWindow.document.write(`<div class="qr-code">${qrImgElement}</div>`);
      printWindow.document.write('</div>');

      // Segunda Sección
      printWindow.document.write('<div class="section2">');
      printWindow.document.write('<div class="details">');
      printWindow.document.write('<h3>Zalei Agropecuaria</h3>');
      if (qrDataJson.Fecha) {
        printWindow.document.write(`<p>Fecha: ${qrDataJson.Fecha}</p>`);
      }
      if (apiResponse.Articulo.DescDetalle) {
        printWindow.document.write(`<p>Color: ${apiResponse.Articulo.DescDetalle}</p>`);
      }
      if (apiResponse.Articulo.DescMedida) {
        printWindow.document.write(`<p>Medida: ${apiResponse.Articulo.DescMedida}</p>`);
      }
      if (apiResponse.Articulo.Descripcion) {
        printWindow.document.write(`<p>Descripción: ${apiResponse.Articulo.Descripcion}</p>`);
      }
      if (qrDataJson.Galpon) {
        printWindow.document.write(`<p>Galpón: ${qrDataJson.Galpon}</p>`);
      }
      printWindow.document.write('</div>');
      printWindow.document.write(`<div class="qr-code">${qrImgElement}</div>`);
      printWindow.document.write('</div>');

      printWindow.document.write('</div>'); // Cerrar página

      printWindow.document.write('</body></html>');

      printWindow.document.close();
      printWindow.focus();
      printWindow.addEventListener('load', () => {
        printWindow.print();
        printWindow.close();
        setLoading(false);
      });
    } catch (error) {
      console.error('Error printing content:', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div id="print-content" className="flex justify-center flex-col items-center hidden" ref={printRef}>
        {apiResponse && (
          <div className="p-4 pt-2 border rounded-lg bg-gray-50 mt-2 text-center">
            <h3 className="text-lg font-semibold mb-2">Detalles del Artículo</h3>
            {apiResponse.Articulo.DescDetalle && (
              <p className="text-sm text-muted-foreground mb-1">
                <span className="font-medium">Color: </span>
                {apiResponse.Articulo.DescDetalle}
              </p>
            )}
            {apiResponse.Articulo.DescMedida && (
              <p className="text-sm text-muted-foreground mb-1">
                <span className="font-medium">Medida: </span>
                {apiResponse.Articulo.DescMedida}
              </p>
            )}
            {apiResponse.Articulo.Descripcion && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Descripción: </span>
                {apiResponse.Articulo.Descripcion}
              </p>
            )}
            {qrData.Galpon && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Galpón: </span>
                {qrData.Galpon}
              </p>
            )}
          </div>
        )}
      </div>
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
