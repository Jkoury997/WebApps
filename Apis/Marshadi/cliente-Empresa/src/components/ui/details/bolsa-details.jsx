import React from "react";

export function BolsaDetails({ dataBolsa }) {
  const Bolsa = dataBolsa.Bolsa;

  if (!Bolsa) return null;

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Detalles del Bolsa</h3>
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
          <span className="font-medium">Color: </span>
          {Bolsa.Detalle}
        </p>
      )}
            {Bolsa.CodProcesoProximo
 && (
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium">Proceso: </span>
          {Bolsa.DescProcesoProximo
          }
        </p>
      )}
    </div>
  );
}
