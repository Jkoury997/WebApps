"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // Para redirigir al usuario

export default function ListadoTiendas() {
  const [tiendas, setTiendas] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga
  const router = useRouter();

  useEffect(() => {
    fetchTiendas();
  }, []);

  const fetchTiendas = async () => {
    setLoading(true); // Activa el estado de carga
    try {
      const response = await fetch("/api/manitas/lugares/list");
      const responseData = await response.json();

      if (response.ok) {
        console.log(responseData);
        // Acceder correctamente al array de "lugares" dentro de "responseData"
        setTiendas(responseData.lugares || []); // Asegurarse de que "lugares" existe
      } else {
        console.error("Error en la respuesta de la API:", responseData);
      }
    } catch (error) {
      console.error("Error fetching tiendas:", error);
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  };

  const handleCreateNew = () => {
    // Redirige al formulario de creación de tienda
    router.push("/dashboard/mantenimiento/lugares/crear");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Nuestras Tiendas</h1>
        <Button
          onClick={handleCreateNew}
          className="bg-primary text-white py-2 px-3 rounded hover:bg-primary-dark"
        >
          <span className="hidden sm:inline">Crear una nueva</span>
          <Plus className="h-5 w-5 sm:hidden" />
        </Button>
      </div>

      {loading ? (
        <p>Cargando tiendas...</p> // Mensaje de carga
      ) : tiendas.length === 0 ? (
        <p>No hay tiendas disponibles.</p> // Mensaje si no hay tiendas
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tiendas.map((tienda) => (
            <Card key={tienda._id}>
              <CardContent className="p-4">
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold mb-2">{tienda.nombre}</h2>
                  <div className="flex items-start mb-2">
                    <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {tienda.direccion}, {tienda.ciudad}, {tienda.pais}
                    </p>
                  </div>
                  <p className="text-sm">Teléfono: {tienda.telefono}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
