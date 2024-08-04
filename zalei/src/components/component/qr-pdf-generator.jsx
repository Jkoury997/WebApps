import React, { useState, useRef } from 'react';
import QRCode from 'qrcode.react';
import { Button } from '../ui/button';
import { Printer } from 'lucide-react';

const QrPrinter = ({ qrData, apiResponse }) => {
  const [loading, setLoading] = useState(false);
  const printRef = useRef();

  const printContent = () => {
    setLoading(true);
    try {
      const printWindow = window.open('', '_blank');
      const printContent = printRef.current.innerHTML;

      // Incluir el contenido del QR
      const qrCanvas = document.querySelector('#qr-canvas canvas');
      const qrImageData = qrCanvas.toDataURL('image/png');
      const qrImgElement = `<img src="${qrImageData}" style="margin: 20px;  width: 256px; height: 256px;" />`;

      printWindow.document.write('<html><head><title></title>');
      printWindow.document.write('<style>body{font-family: Arial, sans-serif; text-align: center;}</style>');
      printWindow.document.write('</head><body>');
      for (let i = 0; i < 2; i++) {
        printWindow.document.write('<h3> Zalei Agropecuaria </h3>')
        printWindow.document.write('<pre>');
        if (apiResponse) {
          if (apiResponse.Articulo.DescDetalle) {
            printWindow.document.write(`Color: ${apiResponse.Articulo.DescDetalle}\n`);
          }
          if (apiResponse.Articulo.DescMedida) {
            printWindow.document.write(`Medida: ${apiResponse.Articulo.DescMedida}\n`);
          }
          if (apiResponse.Articulo.Descripcion) {
            printWindow.document.write(`Descripción: ${apiResponse.Articulo.Descripcion}\n`);
          }
        }
        printWindow.document.write('</pre>');
        printWindow.document.write(qrImgElement);
        for (let i = 0; i < 10; i++) {
          printWindow.document.write('<br />')
        }
      }
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
};

export default QrPrinter;
