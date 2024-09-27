"use client";
import { useParams } from "next/navigation"; // Importar useParams de next/navigation
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Alert } from "@/components/ui/alert";

export default function Page() {
  const { empresaId } = useParams(); // Obtener empresaId desde la URL con useParams
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);

  // Función para cargar datos de la empresa
  useEffect(() => {
    if (empresaId) {
      const cargarEmpresa = async () => {
        try {
          const response = await fetch(`/api/manitas/empresa/obtenerId?id=${empresaId}`);
          if (response.ok) {
            const data = await response.json();
            setNombre(data.nombre);
            setDireccion(data.direccion);
            setTelefono(data.telefono);
            setEmail(data.email);
          } else {
            setAlertMessage({
              type: "error",
              message: "No se pudo cargar la empresa.",
            });
          }
        } catch (error) {
          setAlertMessage({
            type: "error",
            message: error.message,
          });
        }
      };

      cargarEmpresa();
    }
  }, [empresaId]);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage(null);

    // Prepara los datos del formulario
    const empresaData = {
      nombre,
      direccion,
      telefono,
      email,
    };

    try {
      const response = await fetch(`/api/manitas/empresa/editar?id=${empresaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empresaData),
      });

      if (response.ok) {
        const data = await response.json();
        setAlertMessage({
          type: "success",
          message: "Empresa actualizada con éxito.",
        });
      } else {
        setAlertMessage({
          type: "error",
          message: "Error al actualizar la empresa",
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
          <CardTitle>Editar empresa</CardTitle>
          <CardDescription>Usa este formulario para editar una empresa</CardDescription>
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
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="w-full sm:w-auto">
                Editar Empresa
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
