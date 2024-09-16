"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Zap, Hammer, Wrench, Check } from 'lucide-react'

const initialCategories = [
  {
    id: "electricidad",
    name: "Electricidad",
    icon: <Zap className="w-4 h-4" />,
    tasks: [
      { id: 1, title: "Revisar cableado", description: "Inspeccionar el cableado en todas las habitaciones para detectar posibles daños o desgaste.", completed: false },
      { id: 2, title: "Cambiar focos", description: "Reemplazar los focos fundidos en el pasillo y la sala de estar.", completed: false },
      { id: 3, title: "Instalar dimmer", description: "Instalar un interruptor dimmer en el dormitorio principal para control de iluminación.", completed: false },
    ]
  },
  {
    id: "albanileria",
    name: "Albañilería",
    icon: <Hammer className="w-4 h-4" />,
    tasks: [
      { id: 1, title: "Reparar grietas", description: "Sellar y pintar las grietas en la pared del salón.", completed: false },
      { id: 2, title: "Instalar azulejos", description: "Colocar nuevos azulejos en el baño de invitados.", completed: false },
      { id: 3, title: "Arreglar gotera", description: "Localizar y reparar la gotera en el techo de la cocina.", completed: false },
    ]
  },
  {
    id: "plomeria",
    name: "Plomería",
    icon: <Wrench className="w-4 h-4" />,
    tasks: [
      { id: 1, title: "Reparar grifo", description: "Arreglar el grifo que gotea en el lavabo del baño principal.", completed: false },
      { id: 2, title: "Destapar desagüe", description: "Limpiar y destapar el desagüe de la ducha que está obstruido.", completed: false },
      { id: 3, title: "Revisar tuberías", description: "Inspeccionar las tuberías del sótano en busca de posibles fugas.", completed: false },
    ]
  }
]

export default function Component() {
  const [categories, setCategories] = useState(initialCategories)
  const [expandedTasks, setExpandedTasks] = useState({})

  const toggleTaskInfo = (categoryId, taskId) => {
    setExpandedTasks(prev => ({
      ...prev,
      [categoryId]: prev[categoryId] === taskId ? null : taskId
    }))
  }

  const completeTask = (categoryId, taskId) => {
    setCategories(prevCategories => 
      prevCategories.map(category => 
        category.id === categoryId
          ? {
              ...category,
              tasks: category.tasks.map(task => 
                task.id === taskId ? { ...task, completed: true } : task
              )
            }
          : category
      )
    )
  }

  const getPendingTasksCount = (categoryId) => {
    const category = categories.find(c => c.id === categoryId)
    return category ? category.tasks.filter(task => !task.completed).length : 0
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Tareas de Mantenimiento</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={categories[0].id}>
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {category.icon}
                  <span className="hidden md:inline">{category.name}</span>
                </div>
                <Badge variant="secondary">{getPendingTasksCount(category.id)}</Badge>
              </TabsTrigger>
            ))}
          </TabsList>
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <ScrollArea className="h-[400px] pr-4">
                {category.tasks.map((task) => (
                  <div key={task.id} className={`mb-4 ${task.completed ? 'opacity-50' : ''}`}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{task.title}</h3>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleTaskInfo(category.id, task.id)}
                        >
                          {expandedTasks[category.id] === task.id ? 'Ver menos' : 'Ver más'}
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => completeTask(category.id, task.id)}
                          disabled={task.completed}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Terminar tarea
                        </Button>
                      </div>
                    </div>
                    {expandedTasks[category.id] === task.id && (
                      <p className="mt-2 text-sm text-gray-600">{task.description}</p>
                    )}
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}