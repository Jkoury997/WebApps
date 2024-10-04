import React from "react";

export function BolsaDetails({ dataBolsa }) {
  const Bolsa = dataBolsa.Bolsa;

  if (!Bolsa || !Bolsa.IdBolsa) return null;

  return (
    <div className="p-3 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2 text-center">Detalles del Bolsa</h3>
      <div className="grid grid-cols-3 gap-4">
        {Bolsa.IdBolsa && (
          <p className="text-sm text-muted-foreground mb-1">
            <span className="font-medium">Id: </span>
            {Bolsa.IdBolsa}
          </p>
        )}
        {Bolsa.Cabecera && (
          <p className="text-sm text-muted-foreground mb-1">
            <span className="font-medium">Cabecera: </span>
            {Bolsa.Cabecera}
          </p>
        )}
        {Bolsa.Detalle && (
          <p className="text-sm text-muted-foreground mb-1">
            <span className="font-medium">Detalle: </span>
            {Bolsa.Detalle}
          </p>
        )}
      </div>
    </div>
  );
}
