"use client";

import React, { forwardRef, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const OrdenAImprimir = forwardRef(
  ({ firma, despacho = {}, productos = [], empresa = {}, proveedor = {} }, ref) => {
    // Solo mostrar y considerar los productos con retiro
    const items = useMemo(
      () => (Array.isArray(productos) ? productos.filter(p => Number(p?.Retira) > 0) : []),
      [productos]
    );

    // Depósito usado: prioriza el del primer item con Retira > 0
    const { usedDepotCode, usedDepotName, totalUnidades } = useMemo(() => {
      const first = items[0];
      const code = first?.CodAlmacen ?? despacho?.CodAlmacen ?? null;
      const name = first?.DescAlmacen ?? (code && code === despacho?.CodAlmacen ? despacho?.Almacen : null) ?? null;
      const total = items.reduce((acc, it) => acc + Number(it?.Retira || 0), 0);
      return { usedDepotCode: code, usedDepotName: name ?? code ?? null, totalUnidades: total };
    }, [items, despacho?.CodAlmacen, despacho?.Almacen]);

    return (
      <>
        <div ref={ref} className="w-full">
          {/* Encabezado */}
          <div className="print-header">
            <Card className="w-full max-w-full print:shadow-none">
              <CardHeader className="text-center border-b">
                <CardTitle className="text-lg sm:text-xl font-bold">Orden de Despacho</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">{empresa?.nombre || ""}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{empresa?.direccion || ""}</p>
              </CardHeader>
            </Card>
          </div>

          {/* Contenido principal */}
          <div className="print-content">
            {/* Proveedor + Detalles */}
            <Card className="w-full max-w-full print:shadow-none">
              <CardContent className="p-3 sm:p-5 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="text-xs sm:text-sm leading-tight">
                    <h3 className="font-semibold">Proveedor:</h3>
                    <p className="break-words">{proveedor?.Nombre || proveedor?.RazonSocial || "-"}</p>
                    <p className="break-words">{proveedor?.Direccion || "-"}</p>
                    <p className="break-words">{proveedor?.Cuit || "-"}</p>
                  </div>
                  <div className="text-right text-xs sm:text-sm leading-tight">
                    <h3 className="font-semibold">Detalles de la orden:</h3>
                    <p>Orden #: {despacho?.Numero || despacho?.Id || "-"}</p>
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

            {/* Tabla de productos */}
            <Card className="w-full max-w-full print:shadow-none">
              <CardContent className="p-3 sm:p-5">
                <div className="overflow-x-auto">
                  <Table className="min-w-[360px] sm:min-w-[520px] w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-[11px] sm:text-xs">Código</TableHead>
                        <TableHead className="text-[11px] sm:text-xs">Descripción</TableHead>
                        <TableHead className="text-right text-[11px] sm:text-xs">Retira</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((p, i) => (
                        <TableRow key={`${p?.IdArticulo || i}-${p?.Codigo || i}`}>
                          <TableCell className="break-words text-[11px] sm:text-xs">{p?.Codigo}</TableCell>
                          <TableCell className="break-words text-[11px] sm:text-xs">{p?.Descripcion}</TableCell>
                          <TableCell className="text-right text-[11px] sm:text-xs">{p?.Retira}</TableCell>
                        </TableRow>
                      ))}
                      {/* Totales */}
                      <TableRow>
                        <TableCell className="text-right font-semibold text-[11px]" colSpan={2}>
                          Total unidades
                        </TableCell>
                        <TableCell className="text-right font-semibold text-[11px]">
                          {totalUnidades}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pie */}
          <div className="print-footer">
            <Card className="w-full max-w-full print:shadow-none">
              <CardContent className="p-3 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm leading-tight">
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
    className="mt-3 max-w-full"
    style={{ maxHeight: 80 }}
    data-role="firma"            // 👈 AÑADIDO
  />
) : (
  <div className="mt-6 border-b border-dashed border-gray-400 pt-6"></div>
)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CSS global: impresión + helpers */}
        <style jsx global>{`
          @media print {
            html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
            .print-header { position: fixed; top: 0; left: 0; right: 0; height: 110px; }
            .print-footer { position: fixed; bottom: 0; left: 0; right: 0; height: 130px; }
            .print-content { margin-top: 120px; margin-bottom: 140px; }
            /* ✅ Texto más chico SOLO al imprimir / PDF */
            .print-header, .print-content, .print-footer, table, th, td {
              font-size: 10px !important;
              line-height: 1.2 !important;
            }
            .print-content h3, .font-semibold { font-size: 11px !important; }
            .print-content .text-right, .print-footer .text-right { text-align: right; }
          }
          /* Pantalla: un pelín más chico que default para que el PDF no quede enorme */
          .print-header, .print-content, .print-footer { font-size: 12px; line-height: 1.25; }
          .break-words { word-break: break-word; overflow-wrap: anywhere; }
        `}</style>
      </>
    );
  }
);

export default OrdenAImprimir;
