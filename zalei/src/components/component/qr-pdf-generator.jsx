import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Button } from '../ui/button';
import { Printer } from 'lucide-react';
import { Page, Text, View, Document, StyleSheet, Image, pdf } from '@react-pdf/renderer';

// Estilos para el documento PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  qrImage: {
    width: 100,
    height: 100,
  },
});

// Componente para generar el PDF
const MyDocument = ({ qrData, apiResponse, qrImage }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Zalei S.A.</Text>
        <Text style={styles.text}>Fecha: {qrData.Fecha || ''}</Text>
        <Text style={styles.text}>Cantidad: {qrData.Cantidad || ''}</Text>
        <Text style={styles.text}>Color: {apiResponse.Articulo.DescDetalle || ''}</Text>
        <Text style={styles.text}>Medida: {apiResponse.Articulo.DescMedida || ''}</Text>
        <Text style={styles.text}>Descripción: {apiResponse.Articulo.Descripcion || ''}</Text>
        <Text style={styles.text}>Galpón: {qrData.Galpon || ''}</Text>
      </View>
      <View style={styles.qrContainer}>
        <Image style={styles.qrImage} src={qrImage} />
      </View>
    </Page>
  </Document>
);

// Componente principal
export default function QrPrinter({ qrData, apiResponse }) {
  const qrCanvasRef = useRef();
  const iframeRef = useRef(null);
  const [qrImage, setQrImage] = useState('');

  useEffect(() => {
    if (qrCanvasRef.current) {
      const qrCanvas = qrCanvasRef.current.querySelector('canvas');
      if (qrCanvas) {
        setQrImage(qrCanvas.toDataURL('image/png'));
      }
    }
  }, [qrData]);

  const handlePrint = async () => {
    // Generar el documento PDF como un blob
    const doc = <MyDocument qrData={qrData} apiResponse={apiResponse} qrImage={qrImage} />;
    const asPdf = pdf([]);
    asPdf.updateContainer(doc);
    const blob = await asPdf.toBlob();

    // Crear una URL del blob y cargarlo en un iframe oculto
    const pdfUrl = URL.createObjectURL(blob);
    const iframe = iframeRef.current;
    iframe.src = pdfUrl;

    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    };
  };

  return (
    <div className="flex flex-col items-center">
      {/* Generar y mostrar el código QR */}
      <div id="qr-canvas" className="m-3" ref={qrCanvasRef}>
        <QRCode value={qrData} size={200} />
      </div>
      {/* Botón para imprimir directamente el PDF */}
      <Button onClick={handlePrint} className="flex items-center justify-center mt-4 p-2 rounded">
        <Printer className="mr-2" />
        Imprimir QR
      </Button>
      {/* Iframe oculto para la impresión automática */}
      <iframe ref={iframeRef} style={{ display: 'none' }} />
    </div>
  );
}
