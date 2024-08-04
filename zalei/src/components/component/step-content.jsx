import React from 'react';
import { ScanBarcode } from "@/components/component/scan-barcode";
import { EnterQuantity } from "@/components/component/enter-quantity";
import QrPrinter from "@/components/component/qr-pdf-generator";

export function StepContent({ activeStep, handleNextStep, Cantidad, setCantidad, apiResponse, qrData }) {
  switch (activeStep) {
    case 1:
      return <ScanBarcode onScan={handleNextStep} />;
    case 2:
      return <EnterQuantity Cantidad={Cantidad} setCantidad={setCantidad} apiResponse={apiResponse} />;
    case 3:
      return qrData && <QrPrinter qrData={qrData} apiResponse={apiResponse} />;
    default:
      return null;
  }
}
