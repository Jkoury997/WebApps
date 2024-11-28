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
    const fetchTiendas = async () => {
      try {
        const response = await fetch("/api/lux/catalogos/tienda");
        const data = await response.json();
        if (response.ok) {
          setTiendas(Array.isArray(data.Lista) ? data.Lista : []);
        } else {
          console.error("Error al cargar las tiendas:", data.message || "Desconocido");
        }
      } catch (error) {
        console.error("Error al cargar las tiendas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTiendas();
  }, []);

  // Maneja la selección de una tienda
  const handleStoreSelect = (value) => {
    setSelectedStore(value);
  };

  // Maneja la redirección al seleccionar una tienda
  const handleSubmit = () => {
    if (selectedStore) {
      router.push(`/dashboard/tienda/envio-a-tienda/selector/picking?tienda=${selectedStore}`);
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
