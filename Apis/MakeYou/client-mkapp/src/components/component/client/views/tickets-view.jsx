import { useState,useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Barcode } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton";
import QRCode from "react-qr-code";

export default function TicketsView({userData}) {
  const [loading, setLoading] = useState(false);
  const [userCompras, setUserCompras] = useState(null);

  useEffect(() => {
    if (userData?.dni) {
      fetchCompras(userData.dni);
    }
  }, []);

  const fetchCompras = async (dni) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/nasus/cliente/compras?dni=${dni}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Compras del usuario:", data);

      setUserCompras(data);
    } catch (error) {
      console.error("Error al obtener las compras del cliente:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!userCompras || loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }
  return (
    <Card className="w-full max-w-md border-none shadow-none bg-transparent">
      <CardHeader>
        <CardTitle className="text-gray-800">Mis Tickets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
      {userCompras.Lista.map((ticket, index) => (
          <Dialog key={ticket.Numero}>
            <DialogTrigger asChild>
              <Card className="bg-white cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
                <CardContent className="flex justify-between items-center p-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">Ticket #{ticket.Numero}</h3>
                    <p className="text-sm text-gray-500">Fecha: {ticket.Fecha}</p>
                  </div>
                  <Badge variant="secondary" className="bg-brand text-white">
                    {ticket.Monto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                  </Badge>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-gray-800">Detalles del Ticket #{ticket.Numero}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700">Información de Compra</h4>
                  <p>Tienda: {ticket.Tienda}</p>
                  <p>Fecha: {ticket.Fecha}</p>
                  <p>Total: {ticket.Monto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</p>
                  <p>Artículos: 3</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700">Ticket de Cambio</h4>
                  <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg">
                    <QRCode value={ticket.TktCambio} size={150} className="w-full" ></QRCode>
                    <p className="text-center mt-2 text-sm text-gray-600">Código: {ticket.TktCambio}</p>
                  </div>
                </div>
                <Button className="w-full bg-pink-100 text-pink-700 hover:bg-pink-200 hidden">Descargar Ticket</Button>
                
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </CardContent>
    </Card>
  )
}
