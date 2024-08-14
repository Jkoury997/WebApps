import React from 'react';
import { ScanBarcode } from "@/components/component/scan-barcode";
import { EnterQuantity } from "@/components/component/enter-quantity";
import { EnterGalpon } from "@/components/component/enter-galpon";
import QrPrinter from "@/components/component/qr-pdf-generator";

export function StepContent({ activeStep, handleNextStep, Cantidad, setCantidad, apiResponse, qrData, Galpon, setGalpon }) {
  switch (activeStep) {
    case 1:
      return <ScanBarcode onScan={handleNextStep} />;
    case 2:
      return <EnterGalpon Galpon={Galpon} setGalpon={setGalpon} apiResponse={apiResponse} />;
    case 3:
      return <EnterQuantity Cantidad={Cantidad} setCantidad={setCantidad} apiResponse={apiResponse} Galpon={Galpon} />;
    case 4:
      return qrData && <QrPrinter qrData={qrData} apiResponse={apiResponse} />;
    default:
      return null;
  }
}
