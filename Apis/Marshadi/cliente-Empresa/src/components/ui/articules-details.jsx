import React from 'react';

export function ArticleDetails({ dataArticulo}) {
  const articulo = dataArticulo;

  if (!articulo || !articulo.FullCode) return null;

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Detalles del Artículo</h3>
      {articulo.FullCode && (
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium">Codigo: </span>{articulo.FullCode}
        </p>
      )}
      {articulo.DescDetalle && (
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium">Color: </span>{articulo.DescDetalle}
        </p>
      )}
      {articulo.DescMedida && (
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium">Medida: </span>{articulo.DescMedida}
        </p>
      )}
      {articulo.DescArticulo
 && (
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium">Descripción: </span>{articulo.DescArticulo
          }
        </p>
      )}

    </div>
  );
}
