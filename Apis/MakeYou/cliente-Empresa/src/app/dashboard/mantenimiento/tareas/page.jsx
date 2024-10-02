"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Datos de ejemplo
const tasks = [
  { id: 1, title: "Tarea 1", description: "Descripción detallada de la tarea 1", urgent: true },
  { id: 2, title: "Tarea 2", description: "Descripción detallada de la tarea 2", urgent: false },
  { id: 3, title: "Tarea 3", description: "Descripción detallada de la tarea 3", urgent: true },
];

export default function TaskCards() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Listado de Tareas</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <Card key={task.id} className="shadow-lg border border-gray-200 rounded-lg">
            <CardHeader className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
                <CardDescription className="text-sm text-gray-500">ID: {task.id}</CardDescription>
              </div>
              {task.urgent && (
                <Badge variant="destructive" className="h-8 px-3 py-1 text-sm">Urgente</Badge>
              )}
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-gray-700">{task.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
