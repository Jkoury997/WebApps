"use client";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState,useEffect } from "react";
import { Alert } from "@/components/ui/alert";

export default function Page() {
    const { IdCategoria } = useParams();
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const [alertMessage, setAlertMessage] = useState(null);

    useEffect(() => {
        if (IdCategoria) {
          const cargarCategoria = async () => {
            try {
              const response = await fetch(`/api/manitas/categoria/obtenerId?id=${IdCategoria}`);
              if (response.ok) {
                const data = await response.json();
                setTitulo(data.titulo);
                setDescripcion(data.descripcion);



              } else {
                setAlertMessage({
                  type: "error",
                  message: "No se pudo cargar el Categoria.",
                });
              }
            } catch (error) {
              setAlertMessage({
                type: "error",
                message: error.message,
              });
            }
          };
    
          cargarCategoria();
        }
      }, [IdCategoria]);

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita la recarga de la página
        setAlertMessage(null);

        // Prepara los datos del formulario
        const CategoriaData = {
            titulo,
            descripcion,

        };

        try {
            const response = await fetch(`/api/manitas/categoria/editar?id=${IdCategoria}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(CategoriaData),
            });
      
            if (response.ok) {
              const data = await response.json();
              setAlertMessage({
                type: "success",
                message: "Categoria actualizada con éxito.",
              });
            } else {
              setAlertMessage({
                type: "error",
                message: "Error al actualizar la Categoria",
              });
            }
          } catch (error) {
            setAlertMessage({
              type: "error",
              message: error.message,
            });
          }
    };

    return (
        <>
            {alertMessage && (
                <Alert
                    type={alertMessage.type}
                    title={alertMessage.type === "error" ? "Error" : "Éxito"}
                    message={alertMessage.message}
                    onClose={() => setAlertMessage(null)}
                    className="mb-2"
                />
            )}
            <Card>
                <CardHeader>
                    <CardTitle>Crear Categoria</CardTitle>
                    <CardDescription>Usa este formulario para crear una categoria</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Label>titulo</Label>
                            <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                        </div>

                        <div className="mb-4">
                            <Label>Dirección</Label>
                            <Input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
                        </div>

                    
                        <div className="flex justify-end">
                            <Button type="submit" className="w-full sm:w-auto"> Guardar</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}
