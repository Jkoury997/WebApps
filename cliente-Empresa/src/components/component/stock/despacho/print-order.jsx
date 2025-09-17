"use client";

import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import OrdenAImprimir from "@/components/component/stock/despacho/orden-al-imprimir";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function PrintOrden({ firma, despacho, productos, empresa, proveedor }) {
  const componentRef = useRef();

  return (
    // Evita scroll horizontal del layout padre en mobile
    <div className="w-full max-w-full overflow-x-hidden">
      {/* Contenedor fluido: respeta márgenes en móvil */}
      <div className="mx-auto w-full max-w-screen-lg px-2 sm:px-4">
        <div className="flex justify-center items-center mb-4 no-print">
          <ReactToPrint
            trigger={() => (
              <Button className="bg-blue-500 text-white">
                <Printer className="mr-2 h-4 w-4" /> Imprimir Orden
              </Button>
            )}
            content={() => componentRef.current}
            pageStyle={`
              @page { size: A4 portrait; margin: 12mm; }
              @media print {
                html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              }
            `}
          />
        </div>

        <OrdenAImprimir
          ref={componentRef}
          firma={firma}
          despacho={despacho}
          productos={productos}
          empresa={empresa}
          proveedor={proveedor}
        />
      </div>
    </div>
  );
}
