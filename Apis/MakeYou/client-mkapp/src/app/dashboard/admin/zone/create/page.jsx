"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"; // Importa el hook de toast

export default function Page() {
  const [nombre, setNombre] = useState("");
  const router = useRouter();
  const { toast } = useToast(); // Usa el hook para mostrar el toast

  const handleCreateZone = async () => {
    try {
      const response = await fetch(`/api/qrfichaqui/zones/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Zona creada",
          description: "La nueva zona ha sido creada exitosamente.",
          variant: "success",
        }); // Muestra el toast de éxito
        router.push("/dashboard/admin/zone"); // Redirigir a la página principal o a otra página adecuada
      } else {
        toast({
          title: "Error en crear zona",
          description: "Hubo un error en crear la zona.",
          variant: "destructive",
        }); // Muestra el toast de error
      }
    } catch (error) {
      toast({
        title: "Error en crear zona",
        description: "Hubo un error en crear la zona.",
        variant: "destructive",
      }); // Muestra el toast de error
    }
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Crear Nueva Zona
            </h1>
            <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Define los detalles de la nueva zona que deseas crear.
            </p>
          </div>
          <Card>
            <CardContent className="space-y-6 pt-3">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Zona</Label>
                <Input
                  id="nombre"
                  placeholder="Ingresa el nombre de la zona"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleCreateZone}>
                Crear Zona
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
