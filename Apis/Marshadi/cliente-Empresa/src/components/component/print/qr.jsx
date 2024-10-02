import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';


const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
  },
  details: {
    width: '60%',
  },
  header: {
    marginBottom: '20px',
    marginLeft: "20px",
    padding:"20px"
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  qrContainer: {
    width: '35%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrImage: {
    width: '200px',
    height: '200px',
    padding: '20px',
  },
  text: {
    fontSize: '20px',
  }
};

// Componente para el contenido imprimible
const PrintableContent = forwardRef(({ qrData, qrImage }, ref) => (
  <div ref={ref} style={{ position: 'relative', minHeight: '100vh', paddingTop: '50px' }}>
    <div style={styles.container}>
      <div style={styles.details}>
        <div style={styles.header}>
          <h1 style={styles.title}>Marshadi S.R.L. - N° {qrData?.IdBolsa || ''}</h1>
          <p>Fecha: {qrData?.Fecha || ''}</p>
          <p>Articulo: {qrData?.Articulo || ''}</p>
          <p style={styles.text}>Primera: {qrData?.Cantidad || ''}</p>
          <p style={styles.text}>Segunda: {qrData?.Segunda || ''}</p>
        </div>
      </div>
      <div style={styles.qrContainer}>
        <img src={qrImage} alt="QR Code" style={styles.qrImage} />
      </div>
    </div>
  </div>
));

export default function QrPrinterComponent({ qrData }) {
  const qrCanvasRef = useRef();
  const printRef = useRef();
  const [qrImage, setQrImage] = useState('');

  // Convertir qrData a JSON antes de pasarlo a QRCode
  const qrDataJson = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;

  useEffect(() => {
    if (qrCanvasRef.current) {
      const qrCanvas = qrCanvasRef.current.querySelector('canvas');
      if (qrCanvas) {
        setQrImage(qrCanvas.toDataURL('image/png'));
      }
    }
  }, [qrData]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @media print {
        @page {
          size: A4 portrait;
          margin: 0;
        }
        body {
          margin: 0;
        }
      }
    `,
    onPrintError: (error) => {
      console.error("Error durante la impresión:", error);
    },
  });

  return (
    <div className="flex flex-col items-center">
      {/* Generar y mostrar el código QR */}
      <div id="qr-canvas" className="m-3" ref={qrCanvasRef}>
        <QRCodeCanvas value={qrData} size={200} />
      </div>
      {/* Componente que será impreso (oculto en pantalla) */}
      <div style={{ display: 'none' }}>
        <PrintableContent ref={printRef} qrData={qrDataJson} qrImage={qrImage} />
      </div>
      {/* Botón para imprimir directamente el contenido */}
      <Button onClick={handlePrint} className="flex items-center justify-center mt-4 p-2 rounded">
        <Printer className="mr-2" />
        Imprimir QR
      </Button>
    </div>
  );
}
