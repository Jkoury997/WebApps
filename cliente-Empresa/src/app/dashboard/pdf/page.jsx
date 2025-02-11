"use client"
import React from "react";
import OrdenDespacho from "@/components/component/stock/despacho/pdf-despacho";

const App = () => {
    const ordenEjemplo = {
        empresa: {
          nombre: "Zalei Agropecuaria S.A",
          direccion: "RP50 10000, B6005 Gral. Arenales, Provincia de Buenos Aires",
        },
        cliente: {
          nombre: "Juan Pérez",
          direccion: "Avenida Secundaria 456, Ciudad",
          ciudad: "Buenos Aires, Argentina",
        },
        numeroOrden: "OD-67890",
        productos: [
          { cantidad: 3, descripcion: "Producto X", precioUnitario: 120.5 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 3, descripcion: "Producto X", precioUnitario: 120.5 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 3, descripcion: "Producto X", precioUnitario: 120.5 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 3, descripcion: "Producto X", precioUnitario: 120.5 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 3, descripcion: "Producto X", precioUnitario: 120.5 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 3, descripcion: "Producto X", precioUnitario: 120.5 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 3, descripcion: "Producto X", precioUnitario: 120.5 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 3, descripcion: "Producto X", precioUnitario: 120.5 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 3, descripcion: "Producto X", precioUnitario: 120.5 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 3, descripcion: "Producto X", precioUnitario: 120.5 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 3, descripcion: "Producto X", precioUnitario: 120.5 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 3, descripcion: "Producto X", precioUnitario: 120.5 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 3, descripcion: "Producto X", precioUnitario: 120.5 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 3, descripcion: "Producto X", precioUnitario: 120.5 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 3, descripcion: "Producto X", precioUnitario: 120.5 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 3, descripcion: "Producto X", precioUnitario: 120.5 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 3, descripcion: "Producto X", precioUnitario: 120.5 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 3, descripcion: "Producto X", precioUnitario: 120.5 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },
          { cantidad: 3, descripcion: "Producto X", precioUnitario: 120.5 },
          { cantidad: 1, descripcion: "Producto Y", precioUnitario: 90.0 },
          { cantidad: 2, descripcion: "Producto Z", precioUnitario: 75.25 },

        ],
        total: 3 * 120.5 + 1 * 90.0 + 2 * 75.25, // Se calcula el total
        notas: "Revisar correctamente las cantidad antes de firmar",
      };

  return (
    <div>
      <OrdenDespacho orden={ordenEjemplo}/>
    </div>
  );
};

export default App;
