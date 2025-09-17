"use client";

import React, { forwardRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const OrdenAImprimir = forwardRef(
  ({ firma, despacho = {}, productos = [], empresa = {}, proveedor = {} }, ref) => {
    // Depósito usado: prioriza DescAlmacen del primer item con Retira > 0
    const { usedDepotCode, usedDepotName } = useMemo(() => {
      const first = productos.find((p) => Number(p?.Retira ?? 0) > 0);

      const code =
        first?.CodAlmacen ??
        despacho?.CodAlmacen ??
        null;

      const name =
        first?.DescAlmacen ??
        (code && code === despacho?.CodAlmacen ? despacho?.Almacen : null) ??
        null;

      return {
        usedDepotCode: code,
        usedDepotName: name ?? code ?? null,
      };
    }, [productos, despacho?.CodAlmacen, despacho?.Almacen]);

    return (
      <>
        <div ref={ref} className="w-full">
          {/* Encabezado (solo impresión) */}
          <div className="print-header">
            <Card className="w-full max-w-full print:shadow-none">
              <CardHeader className="text-center border-b">
                <CardTitle className="text-xl sm:text-2xl font-bold">Orden de Despacho</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">{empresa.nombre}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{empresa.direccion}</p>
              </CardHeader>
            </Card>
          </div>

          {/* Contenido principal */}
          <div className="print-content">
            {/* Proveedor + Detalles */}
            <Card className="w-full max-w-full print:shadow-none">
              <CardContent className="p-3 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="text-xs sm:text-sm">
                    <h3 className="font-semibold">Proveedor:</h3>
                    <p className="break-words">{proveedor?.Nombre || " "}</p>
                    <p className="break-words">{proveedor?.Direccion || " "}</p>
                    <p className="break-words">{proveedor?.Cuit || " "}</p>
                  </div>
                  <div className="text-right text-xs sm:text-sm">
                    <h3 className="font-semibold">Detalles de la orden:</h3>
                    <p>Orden #: {despacho?.Numero || "-"}</p>
                    <p>Fecha: {new Date().toLocaleDateString()}</p>
                    <p>Almacén de la orden: {despacho?.Almacen || "-"}</p>
                    <p className="font-medium">
                      Almacén de retiro: {usedDepotName || "-"}
                      {usedDepotCode && usedDepotCode !== usedDepotName ? ` (${usedDepotCode})` : ""}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabla de productos (scroll horizontal solo en mobile) */}
            <Card className="w-full max-w-full print:shadow-none">
              <CardContent className="p-3 sm:p-6">
                <div className="overflow-x-auto">
                  <Table className="min-w-[360px] sm:min-w-[520px] w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm">Código</TableHead>
                        <TableHead className="text-xs sm:text-sm">Descripción</TableHead>
                        <TableHead className="text-right text-xs sm:text-sm">Retira</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productos.map((producto, index) => (
                        <TableRow key={index}>
                          <TableCell className="break-words text-xs sm:text-sm">{producto?.Codigo}</TableCell>
                          <TableCell className="break-words text-xs sm:text-sm">{producto?.Descripcion}</TableCell>
                          <TableCell className="text-right text-xs sm:text-sm">{producto?.Retira}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pie (solo impresión) */}
          <div className="print-footer">
            <Card className="w-full max-w-full print:shadow-none">
              <CardContent className="p-3 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <h3 className="font-semibold">Nota:</h3>
                    <p>
                      Entregado a las{" "}
                      {new Date().toLocaleString("es-AR", {
                        timeZone: "America/Argentina/Buenos_Aires",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Firma de Recepción:</h3>
                    {firma ? (
                      <img
                        src={firma}
                        alt="Firma de Recepción"
                        className="mt-4 max-w-full"
                        style={{ maxHeight: "80px" }}
                      />
                    ) : (
                      <div className="mt-4 border-b border-dashed border-gray-400 pt-8"></div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CSS global: impresión + helpers responsive */}
        <style jsx global>{`
          @media print {
            html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
            .print-header { position: fixed; top: 0; left: 0; right: 0; height: 120px; }
            .print-footer { position: fixed; bottom: 0; left: 0; right: 0; height: 140px; }
            .print-content { margin-top: 130px; margin-bottom: 150px; }
          }
          .break-words { word-break: break-word; overflow-wrap: anywhere; }
        `}</style>
      </>
    );
  }
);

export default OrdenAImprimir;
