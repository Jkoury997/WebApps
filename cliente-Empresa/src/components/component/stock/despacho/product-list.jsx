"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function ProductList({ listProducts, despachoInfo, onRetiraSubmit }) {
  const [productos, setProductos] = useState(listProducts || []);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Estado controlado
  const [retiro, setRetiro] = useState({});     // { [IdArticulo]: number }
  const [almacen, setAlmacen] = useState({});   // { [IdArticulo]: string }

  const inputRefs = useRef({});

  // --- Helpers ---
  const getSelectedDepot = (p) =>
    (almacen[p.IdArticulo] ?? despachoInfo?.CodAlmacen ?? (p.Almacenes?.[0]?.Codigo ?? ""));

  const getDepotNameForCode = (code, p) => {
    if (!code) return "";
    // Si es el del despacho, usar su nombre
    if (code === despachoInfo?.CodAlmacen) return despachoInfo?.Almacen || code;
    // Buscar en la lista de almacenes del ítem
    const hit = (Array.isArray(p?.Almacenes) ? p.Almacenes : []).find(a => a?.Codigo === code);
    if (hit?.Descripcion) return hit.Descripcion;
    // Fallback
    return code;
  };

  // Sync props -> estado + defaults (default SIEMPRE el del despacho)
  useEffect(() => {
    const arr = Array.isArray(listProducts) ? listProducts : [];
    setProductos(arr);

    setAlmacen(prev => {
      const next = { ...prev };
      for (const p of arr) {
        if (!next[p.IdArticulo]) {
          const defaultCode = despachoInfo?.CodAlmacen || (p.Almacenes?.[0]?.Codigo ?? "");
          next[p.IdArticulo] = defaultCode;
        }
      }
      return next;
    });

    setRetiro(prev => {
      const next = { ...prev };
      for (const p of arr) {
        if (typeof next[p.IdArticulo] === "undefined") next[p.IdArticulo] = 0;
      }
      return next;
    });
  }, [listProducts, despachoInfo?.CodAlmacen]);

  // Foco + scroll al seleccionar tarjeta
  useEffect(() => {
    if (selectedProductId && inputRefs.current[selectedProductId]) {
      const el = inputRefs.current[selectedProductId];
      el.focus();
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedProductId]);

  // Cambios controlados
 const handleRetiraChange = (producto, rawValue) => {
  const n = Number(rawValue);

  // ✅ ahora el máximo es la cantidad + 30%
  const maxPermitido = Math.floor(producto.Cantidad * 1.3);

  const safe = Number.isFinite(n)
    ? Math.max(0, Math.min(n, maxPermitido))
    : 0;

  setRetiro(prev => ({
    ...prev,
    [producto.IdArticulo]: safe
  }));
};


  const handleAlmacenChange = (idArticulo, codigo) => {
    setAlmacen(prev => ({ ...prev, [idArticulo]: codigo }));
  };

  // Validaciones/resumen + REGLA GLOBAL DE DEPÓSITO ÚNICO
  const {
    invalidItems,
    totalRetira,
    allZero,
    enforcedDepot,
    enforcedDepotDesc,
    crossDepotError,
  } = useMemo(() => {
    let invalid = [];
    let total = 0;

    let enforced = null;
    let enforcedDesc = null;

    // 1) Encontrar depósito "enforced" (del primer ítem con Retira > 0)
    for (const p of productos) {
      const r = Number(retiro[p.IdArticulo] ?? 0);
      if (r > 0) {
        enforced = getSelectedDepot(p);
        enforcedDesc = getDepotNameForCode(enforced, p);
        break;
      }
    }

    // 2) Validar por ítem + detectar conflicto global
    let conflict = false;
    for (const p of productos) {
      const r = Number(retiro[p.IdArticulo] ?? 0);
      total += r;

      const depotCode = getSelectedDepot(p);
      const hasDepot = String(depotCode || "").length > 0;

      const inval =
        !Number.isFinite(r) ||
        r < 0 ||
        r > Number(p.Cantidad) ||
        (r > 0 && !hasDepot);

      if (inval) invalid.push(p.IdArticulo);

      if (enforced && r > 0 && depotCode !== enforced) {
        conflict = true;
      }
    }

    return {
      invalidItems: invalid,
      totalRetira: total,
      allZero: total === 0,
      enforcedDepot: enforced,           // código
      enforcedDepotDesc: enforcedDesc,   // descripción
      crossDepotError: Boolean(enforced) && conflict,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productos, retiro, almacen, despachoInfo?.CodAlmacen]);

// Submit (incluye CodAlmacen y DescAlmacen cuando Retira > 0)
const handleGenerate = () => {
  const result = productos.map(p => {
    const Retira = Number(retiro[p.IdArticulo] ?? 0);
    const cod = getSelectedDepot(p);
    const desc = getDepotNameForCode(cod, p);
    return {
      IdArticulo: p.IdArticulo,
      Codigo: p.Codigo,
      Descripcion: p.Descripcion,
      Cantidad: p.Cantidad,
      Retira,
      ...(Retira > 0 ? { CodAlmacen: cod, DescAlmacen: desc } : {}),
    };
  });

  // ✅ Enviar sólo los que tienen Retira > 0
  const onlyWithRetira = result.filter(item => Number(item.Retira) > 0);

  console.log("Productos a enviar (Retira > 0):", onlyWithRetira);
  onRetiraSubmit?.(onlyWithRetira);
};

  // Deshabilitar submit si: errores por ítem, todo en 0 o hay conflicto de depósitos
  const disableSubmit = invalidItems.length > 0 || allZero || crossDepotError;

  return (
    <div className="space-y-4 pb-4">
      {/* Cabecera del Despacho */}
      <Card>
        <CardHeader className="p-3 pb-1">
          <CardTitle className="text-lg">Información del Despacho</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-1">
          <div className="text-sm">
            <p className="font-medium text-gray-500">ID: {despachoInfo?.Id}</p>
            <p className="font-medium text-gray-500">Número: {despachoInfo?.Numero}</p>
            <p className="font-medium text-gray-500">
              Almacén por defecto: {despachoInfo?.Almacen} ({despachoInfo?.CodAlmacen})
            </p>
          </div>
        </CardContent>
      </Card>


      {/* Lista de Productos */}
      <div>
        <div className="flex items-baseline justify-between gap-2 mb-2">
          <h2 className="text-xl font-bold">Productos para Retirar ({productos.length})</h2>
          <div className="text-sm text-gray-600">
            Total a retirar: <span className="font-semibold">{totalRetira}</span>
          </div>
        </div>

        <div className="space-y-4">
          {productos.map(p => {
            const valueRetira = retiro[p.IdArticulo] ?? 0;
            const selectedAlmacenCode = getSelectedDepot(p);
            const inval = invalidItems.includes(p.IdArticulo);
            const mismatch = Boolean(enforcedDepot) && valueRetira > 0 && selectedAlmacenCode !== enforcedDepot;

            const itemOptions = Array.isArray(p.Almacenes)
              ? p.Almacenes.filter(a => a.Codigo !== despachoInfo?.CodAlmacen)
              : [];

            return (
              <Card
                key={p.IdArticulo}
                className={`w-full ${inval || mismatch ? "ring-2 ring-destructive" : ""}`}
                onClick={() => setSelectedProductId(p.IdArticulo)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <p className="font-semibold text-lg">{p.Descripcion}</p>
                      <div className="text-sm text-gray-600 flex gap-4">
                        <span>ID: {p.IdArticulo}</span>
                        <span>Código: {p.Codigo}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                      {/* Cantidad original */}
                      <div>
                        <p className="text-sm font-medium text-gray-500">Cantidad:</p>
                        <p className="text-lg font-semibold">{p.Cantidad}</p>
                      </div>

                      {/* Retira (controlado) */}
                      <div className="flex flex-col">
                        <label htmlFor={`retira-${p.IdArticulo}`} className="text-sm font-medium text-gray-500">
                          Retira:
                        </label>
                        <Input
                          id={`retira-${p.IdArticulo}`}
                          type="number"
                          ref={(el) => (inputRefs.current[p.IdArticulo] = el)}
                          value={valueRetira}
                          onChange={(e) => handleRetiraChange(p, e.target.value)}
                          min={0}
                          max={Math.floor(p.Cantidad * 1.3)}  // ✅ stock + 30%
                          className="w-28 text-right"
                          placeholder="Cantidad"
                          autoFocus={selectedProductId === p.IdArticulo}
                          inputMode="numeric"
                        />
                        <span className="text-xs text-gray-500 mt-1">Máx: {p.Cantidad}</span>
                      </div>

                      {/* Almacén por ítem */}
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-500">Almacén para este ítem</span>

                        {Array.isArray(p.Almacenes) && p.Almacenes.length > 0 ? (
                          <Select
                            value={selectedAlmacenCode}
                            onValueChange={(val) => handleAlmacenChange(p.IdArticulo, val)}
                          >
                            <SelectTrigger
                              className={`w-full ${mismatch ? "border-destructive text-destructive" : ""}`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <SelectValue placeholder="Elegir almacén" />
                            </SelectTrigger>
                            <SelectContent onClick={(e) => e.stopPropagation()}>
                              {despachoInfo?.CodAlmacen && (
                                <SelectItem value={despachoInfo.CodAlmacen}>
                                  {despachoInfo.Almacen} ({despachoInfo.CodAlmacen})
                                </SelectItem>
                              )}
                              {itemOptions.map((a) => (
                                <SelectItem key={a.Codigo} value={a.Codigo}>
                                  {a.Descripcion} ({a.Codigo})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className={`text-sm border rounded px-3 py-2 ${mismatch ? "border-destructive text-destructive bg-destructive/10" : "text-gray-700 bg-muted/30"}`}>
                            {despachoInfo?.Almacen} ({despachoInfo?.CodAlmacen})
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Errores por ítem */}
                    {(inval || mismatch) && (
                      <p className="text-sm text-destructive">
                        {inval ? (
                          <>Revisá “Retira” (0 a {p.Cantidad}){valueRetira > 0 ? " y seleccioná un depósito válido." : ""}</>
                        ) : (
                          <>Este ítem debe usar el depósito <strong>{enforcedDepotDesc || enforcedDepot}</strong> porque ya hay otros con retiro en ese depósito.</>
                        )}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>


 {/* Banner de regla global */}
      {enforcedDepot && (
        <div className={`rounded-md border p-3 ${crossDepotError ? "border-destructive/50 bg-destructive/10 text-destructive" : "border-emerald-500/30 bg-emerald-50 text-emerald-700"}`}>
          {crossDepotError ? (
            <>
              <strong>Atención:</strong> para generar el retiro, todos los ítems con cantidad &gt; 0 deben usar el <strong>mismo depósito</strong>. Depósito aplicado: <strong>{enforcedDepotDesc || enforcedDepot}</strong>. Revisá los que están marcados en rojo.
            </>
          ) : (
            <>Depósito de retiro seleccionado: <strong>{enforcedDepotDesc || enforcedDepot}</strong>.</>
          )}
        </div>
      )}
      {/* Botón enviar */}
      <div className="mt-6">
        <Button onClick={handleGenerate} className="w-full" disabled={disableSubmit}>
          Generar Retiro
        </Button>
        {disableSubmit && (
          <p className="text-xs text-center text-muted-foreground mt-2">
            No puede haber cantidades fuera de rango, todos en 0, <strong>ni depósitos distintos</strong> entre ítems con retiro.
          </p>
        )}
      </div>
    </div>
  );
}
