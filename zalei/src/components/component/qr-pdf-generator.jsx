import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Button } from '../ui/button';
import { Printer } from 'lucide-react';
import printJS from 'print-js';

export default function QrPrinter({ qrData, apiResponse }) {
  const [loading, setLoading] = useState(false);
  const [qrImageData, setQrImageData] = useState(null);

  useEffect(() => {
    // Este efecto se ejecuta solo en el cliente
    const qrCanvas = document.querySelector('#qr-canvas canvas');
    if (qrCanvas) {
      setQrImageData(qrCanvas.toDataURL('image/png'));
    }
  }, [qrData]);

  const handlePrint = () => {
    if (!qrImageData) return;

    setLoading(true);

    const qrDataJson = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;

    const printContent = `
    <div style="width: 100%; max-width: 210mm; height: auto; padding: 20mm; box-sizing: border-box; font-family: Arial, sans-serif;">
      <div style="display: flex; flex-direction: column; height: 100%; justify-content: space-between;">
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20mm;">
          <div style="width: 60%; text-align: left;">
            ${qrDataJson.Fecha ? `<h3 style="margin-bottom: 10px;">Zalei S.A. - Fecha: ${qrDataJson.Fecha}</h3>` : ''}
            ${qrDataJson.Cantidad ? `<p style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Cantidad: ${qrDataJson.Cantidad}</p>` : ''}
            ${apiResponse.Articulo.DescDetalle ? `<p style="margin-bottom: 5px;">Color: ${apiResponse.Articulo.DescDetalle}</p>` : ''}
            ${apiResponse.Articulo.DescMedida ? `<p style="margin-bottom: 5px;">Medida: ${apiResponse.Articulo.DescMedida}</p>` : ''}
            ${apiResponse.Articulo.Descripcion ? `<p style="margin-bottom: 5px;">Descripción: ${apiResponse.Articulo.Descripcion}</p>` : ''}
            ${qrDataJson.Galpon ? `<p>Galpón: ${qrDataJson.Galpon}</p>` : ''}
          </div>
          <div style="width: 50%; text-align: right;">
            <img src="${qrImageData}" style="margin: 20px; width: 150px; height: 150px; padding: 10px; border: 2px solid #333; border-radius: 10px;" />
          </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; transform: rotate(180deg); margin-top: 20mm;">
          <div style="width: 60%; text-align: left;">
            ${qrDataJson.Fecha ? `<h3 style="margin-bottom: 10px;">Zalei S.A. - Fecha: ${qrDataJson.Fecha}</h3>` : ''}
            ${qrDataJson.Cantidad ? `<p style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">Cantidad: ${qrDataJson.Cantidad}</p>` : ''}
            ${apiResponse.Articulo.DescDetalle ? `<p style="margin-bottom: 5px;">Color: ${apiResponse.Articulo.DescDetalle}</p>` : ''}
            ${apiResponse.Articulo.DescMedida ? `<p style="margin-bottom: 5px;">Medida: ${apiResponse.Articulo.DescMedida}</p>` : ''}
            ${apiResponse.Articulo.Descripcion ? `<p style="margin-bottom: 5px;">Descripción: ${apiResponse.Articulo.Descripcion}</p>` : ''}
            ${qrDataJson.Galpon ? `<p>Galpón: ${qrDataJson.Galpon}</p>` : ''}
          </div>
          <div style="width: 50%; text-align: right;">
            <img src="${qrImageData}" style="margin: 20px; width: 150px; height: 150px; padding: 10px; border: 2px solid #333; border-radius: 10px;" />
          </div>
        </div>
        
      </div>
    </div>
    `;

    printJS({
      printable: printContent,
      type: 'raw-html',
      targetStyles: ['*'], // Incluir todos los estilos en la impresión
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
