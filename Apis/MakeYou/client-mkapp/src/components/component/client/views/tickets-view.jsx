import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Barcode } from 'lucide-react'

export default function TicketsView() {
  return (
    <Card className="w-full max-w-md border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-gray-800">Mis Tickets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((ticket) => (
          <Dialog key={ticket}>
            <DialogTrigger asChild>
              <Card className="bg-white cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">Ticket #{ticket}</h3>
                    <p className="text-sm text-gray-500">Fecha: {new Date().toLocaleDateString()}</p>
                  </div>
                  <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                    ${(Math.random() * 100).toFixed(2)}
                  </Badge>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-gray-800">Detalles del Ticket #{ticket}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Información de Compra</h4>
                  <p>Fecha: {new Date().toLocaleDateString()}</p>
                  <p>Total: ${(Math.random() * 100).toFixed(2)}</p>
                  <p>Artículos: 3</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Ticket de Cambio</h4>
                  <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg">
                    <Barcode className="w-full h-16 text-gray-700" />
                    <p className="text-center mt-2 text-sm text-gray-600">Código: TC-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                  </div>
                </div>
                <Button className="w-full bg-pink-100 text-pink-700 hover:bg-pink-200">Descargar Ticket</Button>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </CardContent>
    </Card>
  )
}
