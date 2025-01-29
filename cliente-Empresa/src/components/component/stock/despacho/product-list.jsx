'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProductList({ listProducts, despachoInfo, onRetiraSubmit }) {
  const [productos, setProductos] = useState(listProducts);
  const [debouncedValue, setDebouncedValue] = useState({});
  const [selectedProductId, setSelectedProductId] = useState(null); // Estado para el producto seleccionado
  const inputRefs = useRef({}); // Referencia para múltiples inputs
  const retiroValues = useRef({}); // Referencia para almacenar valores de "Retira"

  // Manejador para cambios en el valor del campo "Retira" con debounce
  const handleRetiraChange = (id, value) => {
    retiroValues.current[id] = value; // Almacenar el valor en la referencia
    setDebouncedValue({ id, value }); // Actualizar estado para cualquier otra lógica necesaria
  };

  // Enfocar y centrar el input cuando se selecciona un producto
  useEffect(() => {
    if (selectedProductId && inputRefs.current[selectedProductId]) {
      const inputElement = inputRefs.current[selectedProductId];
      inputElement.focus();
      inputElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center', // Centrar el input en la vista
      });
    }
  }, [selectedProductId]);

  // Manejar impresión en consola de los valores de "Retira"
  const handlePrintRetira = () => {
    const result = productos.map((producto) => ({
      IdArtciulo: producto.IdArtciulo,
      Cantidad: producto.Cantidad,
      Descripcion: producto.Descripcion,
      Retira: retiroValues.current[producto.IdArtciulo] || 0, // Si no se ha modificado, asumir 0
    }));
    console.log("Productos con Retira:", result);
    onRetiraSubmit(result); // Llamamos la función que recibimos como prop
  };

  return (
    <div className="space-y-4 pb-4">
      <Card>
        <CardHeader className="p-3 pb-1">
          <CardTitle className="text-lg">Información del Despacho</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-1">
          <div className="text-sm">
            <p className="font-medium text-gray-500">ID: {despachoInfo.Id}</p>
            <p className="font-medium text-gray-500">Número: {despachoInfo.Numero}</p>
            <p className="font-medium text-gray-500">Almacén: {despachoInfo.Almacen} ({despachoInfo.CodAlmacen})</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-40">
        <h2 className="text-xl font-bold mb-4">Productos para Retirar ({productos.length})</h2>

        <div className="space-y-4">
          {productos.map((producto) => (
            <Card
              key={producto.IdArtciulo}
              className="w-full cursor-pointer"
              onClick={() => setSelectedProductId(producto.IdArtciulo)} // Seleccionar producto al hacer clic
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="font-semibold text-lg">{producto.Descripcion}</p>
                  <div className="text-sm text-gray-600">
                    <p>ID: {producto.IdArtciulo}</p>
                    <p>Código: {producto.Codigo}</p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Cantidad:</p>
                      <p className="text-lg font-semibold">{producto.Cantidad}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <label htmlFor={`retira-${producto.IdArtciulo}`} className="text-sm font-medium text-gray-500">
                        Retira:
                      </label>
                      <Input
                        id={`retira-${producto.IdArtciulo}`}
                        type="number"
                        ref={(el) => (inputRefs.current[producto.IdArtciulo] = el)} // Asignar la referencia al producto correspondiente
                        onChange={(e) => handleRetiraChange(producto.IdArtciulo, Number(e.target.value))}
                        min={0}
                        max={producto.Cantidad}
                        className="w-20 text-right"
                        autoFocus={selectedProductId === producto.IdArtciulo} // Enfocar automáticamente si es el producto seleccionado
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
      </div>

              {/* Botón para imprimir los valores */}
              <div className="mt-6 flex justify-center">
          <Button onClick={handlePrintRetira} className="w-full">
            Generar Retiro
          </Button>
        </div>
    </div>
  );
}
