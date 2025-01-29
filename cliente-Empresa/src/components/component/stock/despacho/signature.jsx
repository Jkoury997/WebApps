"use client";

import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Signature() {
  const sigCanvas = useRef(null);
  const [firmaURL, setFirmaURL] = useState(null);

  const limpiar = () => {
    sigCanvas.current?.clear();
    setFirmaURL(null);
  };

  const guardar = () => {
    if (sigCanvas.current?.isEmpty()) {
      alert("Por favor, realiza una firma antes de guardar.");
      return;
    }
    const dataURL = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png");
    setFirmaURL(dataURL);
  };

  return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Firma Digital</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-300 rounded-md overflow-hidden">
            <SignatureCanvas
              ref={sigCanvas}
              canvasProps={{
                className: "w-full h-64",
              }}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={limpiar} variant="outline">
            Limpiar
          </Button>
          <Button onClick={guardar}>Guardar Firma</Button>
        </CardFooter>
      </Card>
  );
}