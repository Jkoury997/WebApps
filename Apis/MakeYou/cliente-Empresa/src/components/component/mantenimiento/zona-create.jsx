"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Check, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation"; //

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(5, {
    message: "El nombre de la zona debe tener al menos 5 caracteres.",
  }),
});

export default function ZoneCreationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter(); // 🔹 Inicializa el router para redirigir

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values) {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/mantenimiento/zona/crear`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: values.name }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la zona.");
      }

      setIsSuccess(true);

      // Resetear el formulario antes de redirigir
      form.reset();

      // 🔹 Espera 2 segundos y redirige a `/zona`
      setTimeout(() => {
        router.push("/dashboard/mantenimiento/zona");
      }, 2000);
    } catch (error) {
      console.error("Error al crear la zona:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Crear Zona</CardTitle>
        <CardDescription>Ingrese un nombre para crear una nueva zona.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Zona</FormLabel>
                  <FormControl>
                    <Input placeholder="Escriba el nombre de la zona" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creando...
                </>
              ) : isSuccess ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  ¡Creada!
                </>
              ) : (
                "Crear Zona"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
