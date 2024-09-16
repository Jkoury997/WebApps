"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { LoaderIcon } from "lucide-react"

export default function CrearLugar() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    ciudad: "",
    pais: "",
    telefono: ""
  });
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Para manejar el mensaje de error
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(""); // Limpiar el error al iniciar la solicitud

    try {
      const response = await fetch('/api/manitas/lugares/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el lugar');
      }

      const data = await response.json();
      console.log('Lugar creado exitosamente:', data);

      setShowAlert(true); // Mostrar alerta de éxito

      setFormData({
        nombre: "",
        direccion: "",
        ciudad: "",
        pais: "",
        telefono: ""
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        setShowAlert(false);
        router.push('/dashboard/mantenimiento/lugares');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message); // Almacenar el mensaje de error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl text-center">Crear Nuevo Lugar</CardTitle>
      </CardHeader>
      <CardContent>
        {showAlert && (
          <Alert className="mb-2" type="success" title="Éxito" message="El lugar se creó correctamente." />
        )}
        {errorMessage && (
          <Alert className="mb-2" type="error" title="Error" message={errorMessage} />
        )}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="space-y-2 md:flex md:space-y-0 md:space-x-4">
            <div className="w-full md:w-1/2">
              <Label htmlFor="nombre" className="text-sm md:text-base">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            <div className="w-full md:w-1/2">
              <Label htmlFor="telefono" className="text-sm md:text-base">Teléfono</Label>
              <Input
                id="telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="direccion" className="text-sm md:text-base">Dirección</Label>
            <Input
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ciudad" className="text-sm md:text-base">Ciudad</Label>
            <Input
              id="ciudad"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pais" className="text-sm md:text-base">País</Label>
            <Input
              id="pais"
              name="pais"
              value={formData.pais}
              onChange={handleChange}
              required
              className="mt-1"
            />
          </div>
          <div className="flex justify-end mt-6">
            <Button disabled={isLoading} type="submit" className="w-full md:w-auto md:px-8">
              {isLoading ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  Cargando
                </>
              ) : (
                "Crear Lugar"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
