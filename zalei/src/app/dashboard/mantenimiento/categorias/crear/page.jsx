"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";  // Asegúrate de que tengas el componente Button disponible
import { Alert } from '@/components/ui/alert'; // Importamos el componente de alertas
import { useRouter } from 'next/navigation';

export default function Page() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', title: '', message: '' });
  const router = useRouter()

  const handleCrearCategoria = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/manitas/categorias/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo,
          descripcion,
        }),
      });

      if (response.ok) {
        setAlert({
          type: 'success',
          title: 'Éxito',
          message: 'Categoría creada exitosamente',
        });
        setTitulo('');
        setDescripcion('');
        router.push("/dashboard/mantenimiento/categorias")
      } else {
        throw new Error('Error al crear la categoría');
      }
    } catch (error) {
      setAlert({
        type: 'error',
        title: 'Error',
        message: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Creación de Categorías</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ingrese el nombre de la categoría"
            />
          </div>
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ingrese la descripción de la categoría"
            />
          </div>
          <div>
            <Button onClick={handleCrearCategoria} disabled={isLoading}>
              {isLoading ? 'Cargando...' : 'Crear Categoría'}
            </Button>
          </div>
        </div>
        {/* Mostrar el mensaje de alerta si existe */}
        {alert.message && (
          <div className="mt-4">
            <Alert type={alert.type} title={alert.title} message={alert.message} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
