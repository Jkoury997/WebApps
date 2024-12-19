import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Package, Truck, Home, Calendar } from 'lucide-react'

export default function PedidosView() {
  return (
    <Card className="w-full max-w-md border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-gray-800">Mis Pedidos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((pedido) => (
          <Dialog key={pedido}>
            <DialogTrigger asChild>
              <Card className="bg-white cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">Pedido #{pedido}</h3>
                    <p className="text-sm text-gray-500">Estado: En proceso</p>
                  </div>
                  <Badge variant="secondary" className="bg-pink-100 text-pink-700">
                    Ver detalles
                  </Badge>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-gray-800">Detalles del Pedido #{pedido}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-pink-700 border-pink-300">En proceso</Badge>
                  <span className="text-sm text-gray-500">Pedido el: {new Date().toLocaleDateString()}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Artículos</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center">
                      <span>Producto A</span>
                      <span className="text-gray-600">x2</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Producto B</span>
                      <span className="text-gray-600">x1</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Producto C</span>
                      <span className="text-gray-600">x3</span>
                    </li>
                  </ul>
                </div>
                <div className="flex justify-between items-center font-semibold">
                  <span>Total</span>
                  <span>${(Math.random() * 200 + 50).toFixed(2)}</span>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700">Seguimiento del Pedido</h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <Package className="w-4 h-4 mr-2" />
                    <span>Pedido recibido</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Truck className="w-4 h-4 mr-2" />
                    <span>En camino</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Home className="w-4 h-4 mr-2" />
                    <span>Entregado</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Fecha estimada de entrega</span>
                  </div>
                  <span>{new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </CardContent>
    </Card>
  )
}
