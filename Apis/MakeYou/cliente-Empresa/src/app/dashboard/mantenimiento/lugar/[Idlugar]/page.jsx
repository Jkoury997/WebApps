"use client";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState,useEffect } from "react";
import { Alert } from "@/components/ui/alert";

export default function Page() {
    const { Idlugar } = useParams();
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [pais, setPais] = useState("");
    const [barrio, setBarrio] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [alertMessage, setAlertMessage] = useState(null);

    useEffect(() => {
        if (Idlugar) {
          const cargarLugar = async () => {
            try {
              const response = await fetch(`/api/manitas/lugar/obtenerId?id=${Idlugar}`);
              if (response.ok) {
                const data = await response.json();
                setNombre(data.nombre);
                setDireccion(data.direccion);
                setTelefono(data.telefono);
                setBarrio(data.barrio)
                setPais(data.pais)
                setCiudad(data.ciudad)


              } else {
                setAlertMessage({
                  type: "error",
                  message: "No se pudo cargar el Lugar.",
                });
              }
            } catch (error) {
              setAlertMessage({
                type: "error",
                message: error.message,
              });
            }
          };
    
          cargarLugar();
        }
      }, [Idlugar]);

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita la recarga de la página
        setAlertMessage(null);

        // Prepara los datos del formulario
        const LugarData = {
            nombre,
            direccion,
            telefono,
            pais,
            barrio,
            ciudad
        };

        try {
            const response = await fetch(`/api/manitas/lugar/editar?id=${Idlugar}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(LugarData),
            });
      
            if (response.ok) {
              const data = await response.json();
              setAlertMessage({
                type: "success",
                message: "Lugar actualizado con éxito.",
              });
            } else {
              setAlertMessage({
                type: "error",
                message: "Error al actualizar el Lugar",
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
                    <CardTitle>Crear Lugar</CardTitle>
                    <CardDescription>Usa este formulario para crear un Lugar</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Label>Nombre</Label>
                            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                        </div>

                        <div className="mb-4">
                            <Label>Dirección</Label>
                            <Input value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
                        </div>

                        <div className="mb-4">
                            <Label>Teléfono</Label>
                            <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                        </div>

                        <div className="mb-4">
                            <Label>País</Label>
                            <Input value={pais} onChange={(e) => setPais(e.target.value)} required />
                        </div>

                        <div className="mb-4">
                            <Label>Barrio</Label>
                            <Input value={barrio} onChange={(e) => setBarrio(e.target.value)} required />
                        </div>

                        <div className="mb-4">
                            <Label>Ciudad</Label>
                            <Input value={ciudad} onChange={(e) => setCiudad(e.target.value)} required />
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
