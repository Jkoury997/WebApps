"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function Page() {
  const [selectedStore, setSelectedStore] = useState(""); // Estado para la tienda seleccionada
  const [tiendas, setTiendas] = useState([]); // Estado para las tiendas disponibles
  const [loading, setLoading] = useState(true); // Estado de carga para la API
  const router = useRouter(); // Hook para redirigir

  // Llamada a la API para obtener las tiendas
  useEffect(() => {

    fetchTiendas();
  }, []);

  const fetchTiendas = async () => {
    try {
      // Realizar la solicitud a la API
      const response = await fetch("/api/lux/catalogos/tienda");
  
      // Verificar si la respuesta HTTP es exitosa
      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          `Error al cargar las tiendas: ${errorData.message || "Desconocido"}`
        );
        setTiendas([]); // Asegurarse de limpiar los datos en caso de error
        return;
      }
  
      // Intentar parsear los datos de la respuesta
      const data = await response.json();
  
      // Verificar si los datos contienen la estructura esperada
      if (Array.isArray(data.Lista)) {
        setTiendas(data.Lista); // Actualizar el estado con las tiendas
      } else {
        console.error("La respuesta no contiene una lista válida.");
        setTiendas([]); // Asegurarse de limpiar los datos en caso de estructura inesperada
      }
    } catch (error) {
      // Manejo de errores generales, como problemas de red
      console.error("Error al cargar las tiendas:", error.message || error);
      setTiendas([]); // Asegurarse de limpiar los datos en caso de error general
    } finally {
      // Marcar como terminado el estado de carga
      setLoading(false);
    }
  };
  

  // Maneja la selección de una tienda
  const handleStoreSelect = (value) => {
    setSelectedStore(value);
  };

  // Maneja la redirección al seleccionar una tienda
  const handleSubmit = () => {
    if (selectedStore) {
      router.push(`/dashboard/tienda/envio-a-tienda/picking/${selectedStore}`);
    } else {
      console.log("Por favor, selecciona una tienda antes de continuar.");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tienda de destino</CardTitle>
        <CardDescription>
          Este formulario es para seleccionar a dónde se enviarán los productos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-gray-500">Cargando tiendas...</p>
        ) : (
          <Select onValueChange={handleStoreSelect} value={selectedStore}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una tienda" />
            </SelectTrigger>
            <SelectContent>
              {tiendas.map((tienda) => (
                <SelectItem key={tienda.Codigo} value={tienda.Codigo}>
                  {tienda.Descripcion}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full" disabled={!selectedStore}>
          {selectedStore ? "Seleccionar" : "Selecciona una tienda"}
        </Button>
      </CardFooter>
    </Card>
  );
}
