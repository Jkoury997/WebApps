"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation"; // Importa useRouter
import { useCurrentUrl } from "@/hooks/useCurrentUrl";

export default function Page() {
  const [selectedStore, setSelectedStore] = useState('');
  const [tiendas, setTiendas] = useState([]);
  const router = useRouter(); // Inicializa el hook useRouter

  const baseUrl = useCurrentUrl()
  // Llamada a la API para obtener las tiendas
  useEffect(() => {
    const fetchTiendas = async () => {
      try {
        const response = await fetch("/api/lux/catalogos/tienda");
        const data = await response.json();
        console.log(data);
        setTiendas(data.Lista || []);
      } catch {
        console.log("No se pudo cargar");
      }
    };

    fetchTiendas();
  }, []);

  const handleStoreSelect = (value) => {
    setSelectedStore(value);
  };

  const handleSubmit = () => {
    if (selectedStore) {
        router.push(`${baseUrl}/picking?tienda=${selectedStore}`);
    } else {
      console.log('Por favor, selecciona una tienda antes de continuar.');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tienda de destino</CardTitle>
        <CardDescription>Este formulario es para seleccionar a dónde se enviarán los productos</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} className="w-full">
          {selectedStore ? 'Seleccionar' : 'Selecciona una tienda'}
        </Button>
      </CardFooter>
    </Card>
  );
}
