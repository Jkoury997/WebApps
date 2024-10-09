"use client"

import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ClipboardListIcon, FileTextIcon } from 'lucide-react'

export function PlanDetails({ dataPlan,cantidad }) {
  if (!dataPlan) return null

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="plan-details">
            <AccordionTrigger className="px-4 py-2 focus:no-underline">
              <div className="flex items-center gap-2">
                <ClipboardListIcon className="h-5 w-5 text-primary" />
                <span className="font-semibold">Detalles del Plan</span>
                {dataPlan.NumeroPlan && (
                  <Badge variant="secondary" className="ml-2">
                    N° {dataPlan.NumeroPlan}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4 py-2 space-y-4">
                {dataPlan.NumeroPlan && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                      N° Plan:
                    </span>
                    <Badge variant="outline">{dataPlan.NumeroPlan}</Badge>
                  </div>
                )}
                {dataPlan.NumeroPlan && dataPlan.DescArticulo && <Separator />}
                {dataPlan.DescArticulo && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                      Descripción:
                    </span>
                    <p className="text-sm text-muted-foreground bg-muted p-2 rounded-md">
                      {dataPlan.DescArticulo}
                    </p>
                  </div>
                )}

{dataPlan.DescArticulo && cantidad && <Separator />}
                {cantidad && (
                  <div className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                    Cantidad:
                  </span>
                  <Badge >{cantidad}</Badge>
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