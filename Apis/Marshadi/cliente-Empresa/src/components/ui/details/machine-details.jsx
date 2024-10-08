"use client"

import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ClipboardListIcon, FileTextIcon } from 'lucide-react'

export function MachineDetails({ dataMaquina }) {
  if (!dataMaquina) return null


  return(
    <Card className="w-full max-w-md mx-auto">
    <CardContent className="p-0">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="plan-details">
            <AccordionTrigger className="px-4 py-2 focus:no-underline">
            <div className="flex items-center gap-2">
              <ClipboardListIcon className="h-5 w-5 text-primary" />
              <span className="font-semibold">Detalles del Maquina</span>
              {dataMaquina.CodMaquina && (
                  <Badge variant="secondary" className="ml-2">
                    N° {dataMaquina.CodMaquina}
                  </Badge>
                )}
              </div>
              </AccordionTrigger>
              <AccordionContent>
              <div className="px-4 py-2 space-y-4">
                {dataMaquina.CodMaquina && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                      Maquina:
                    </span>
                    <Badge variant="outline">{dataMaquina.CodMaquina}</Badge>
                  </div>
                  )}
                  {dataMaquina.CodMaquina && dataMaquina.Descripcion && <Separator />}
                  {dataMaquina.Descripcion && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                      Descripción:
                    </span>
                    <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                      {dataMaquina.Descripcion}
                    </p>
                  </div>
                )}

{dataMaquina.CodMaquina && dataMaquina.Tipo && <Separator />}
{dataMaquina.Tipo && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                      Tipo:
                    </span>
                    <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                      {dataMaquina.Tipo}
                    </p>
                  </div>
                )}
                </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}