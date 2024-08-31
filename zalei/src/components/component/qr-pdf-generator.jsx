import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Button } from '../ui/button';
import { Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import printJS from 'print-js';

export default function QrPrinter({ qrData, apiResponse }) {
  const [qrImageData, setQrImageData] = useState(null);

  useEffect(() => {
    const qrCanvas = document.querySelector('#qr-canvas canvas');
    if (qrCanvas) {
      setQrImageData(qrCanvas.toDataURL('image/png'));
    }
  }, [qrData]);

  const handlePrintPDF = () => {
    if (!qrImageData) return;

    const qrDataJson = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;

    // Crear una instancia de jsPDF
    const doc = new jsPDF('portrait', 'mm', 'a4');

    // Configurar el PDF: agregar textos y la imagen del QR
    doc.setFont('Arial');
    doc.setFontSize(12);
    doc.text(`Zalei S.A.`, 20, 30);
    doc.text(`Fecha: ${qrDataJson.Fecha || ''}`, 20, 40);
    doc.text(`Cantidad: ${qrDataJson.Cantidad || ''}`, 20, 50);
    doc.text(`Color: ${apiResponse.Articulo.DescDetalle || ''}`, 20, 60);
    doc.text(`Medida: ${apiResponse.Articulo.DescMedida || ''}`, 20, 70);
    doc.text(`Descripción: ${apiResponse.Articulo.Descripcion || ''}`, 20, 80);
    doc.text(`Galpón: ${qrDataJson.Galpon || ''}`, 20, 90);

    // Agregar la imagen del QR
    doc.addImage(qrImageData, 'PNG', 150, 30, 50, 50);

    // Detectar si el usuario está en un dispositivo móvil (iOS o Android)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // En dispositivos móviles, abrir el PDF en una nueva ventana
      const pdfDataUri = doc.output('dataurlstring');
      window.open(pdfDataUri);
    } else {
      // En otros dispositivos, imprimir con printJS
      const pdfBase64 = doc.output('datauristring').split(',')[1];
      printJS({ printable: pdfBase64, type: 'pdf', base64: true });
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Generar y mostrar el código QR */}
      <div id="qr-canvas" className="m-3">
        <QRCode value={qrData} size={200} />
      </div>
      {/* Botón para generar e imprimir el PDF */}
      <Button onClick={handlePrintPDF} className="flex items-center justify-center mt-4 p-2 rounded">
        <Printer className="mr-2" />
        Generar y Ver PDF
      </Button>
    </div>
  );
}
