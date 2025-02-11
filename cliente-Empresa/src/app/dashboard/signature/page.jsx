"use client";

import { useState } from "react";
import Signature from "@/components/component/stock/despacho/signature";
import { Button } from "@/components/ui/button";
import { jsPDF } from "jspdf";

export default function ParentComponent() {
  const [firma, setFirma] = useState(null);

  // Función que se ejecuta cuando se guarda la firma
  const handleSignatureSave = (dataURL) => {
    setFirma(dataURL);
  };

  const handleGenerarPDF = () => {

  };

  return (
    <div>
      <Signature onSave={handleSignatureSave} />
      <Button onClick={handleGenerarPDF}>Generar PDF con Firma</Button>
    </div>
  );
}
