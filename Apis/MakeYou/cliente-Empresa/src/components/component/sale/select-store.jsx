import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const handlerTiendas = async (setTiendas) => {
  try {
    const response = await fetch("/api/leona/catalogos/tiendas"); // Corrección en la URL
    
    if (!response.ok) {
      throw new Error("Error al obtener las tiendas");
    }
    const data = await response.json();
    console.log(data)
    setTiendas(data.Lista); // Guardamos las tiendas en el estado
  } catch (error) {
    console.error("Error al cargar tiendas:", error);
  }
};

export function StoreSelector({ selectedStore, setSelectedStore }) {
  const [tiendas, setTiendas] = useState([]);

  // Cargar las tiendas al montar el componente
  useEffect(() => {
    handlerTiendas(setTiendas);
  }, []);

  return (
    <Select value={selectedStore} onValueChange={setSelectedStore}>
      <SelectTrigger className="w-full sm:w-[180px]">
        <SelectValue placeholder="Seleccionar tienda" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ZZZZZ">Todas las tiendas</SelectItem>
        {tiendas.map((tienda) => (
          <SelectItem key={tienda.Codigo} value={tienda.Codigo}>
            {tienda.Descripcion}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
