"use client"

import { useState } from "react"
import { PrinterIcon, QrCode, Share2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu" // Asumiendo que tienes un componente DropdownMenu

export default function Component({ almacenes }) {
  const [selectedAlmacen, setSelectedAlmacen] = useState(null)

  const handleShare = (almacen) => {
    alert(`Compartiendo información del ${almacen.nombre}`)
  }

  return (
    <div className="container mx-auto p-4 bg-white rounded-md">
      <h1 className="text-2xl font-bold mb-4">Lista de Almacenes</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Codigo</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {almacenes.map((almacen) => (
            <TableRow key={almacen.codigo}>
              <TableCell>{almacen.nombre}</TableCell>
              <TableCell>{almacen.codigo}</TableCell>
              <TableCell>
                {/* Contenedor de botones para desktop y menú para mobile */}
                <div className="flex md:space-x-2">
                  {/* Botones visibles en desktop */}
                  <div className="hidden md:flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setSelectedAlmacen(almacen)}
                        >
                          <QrCode className="h-4 w-4" />
                          <span className="sr-only">Ver QR</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Código QR para {selectedAlmacen?.nombre}</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center items-center h-64">
                          <QrCode className="h-48 w-48" />
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleShare(almacen)}
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="sr-only">Compartir</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleShare(almacen)}
                    >
                      <PrinterIcon className="h-4 w-4" />
                      <span className="sr-only">Imprimir</span>
                    </Button>
                  </div>

                  {/* Menú desplegable visible en mobile */}
                  <div className="md:hidden">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Ver acciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setSelectedAlmacen(almacen)}
                              >
                                <QrCode className="h-4 w-4" />
                                <span className="sr-only">Ver QR</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Código QR para {selectedAlmacen?.nombre}</DialogTitle>
                              </DialogHeader>
                              <div className="flex justify-center items-center h-64">
                                <QrCode className="h-48 w-48" />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleShare(almacen)}
                          >
                            <Share2 className="h-4 w-4" />
                            <span className="sr-only">Compartir</span>
                          </Button>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleShare(almacen)}
                          >
                            <PrinterIcon className="h-4 w-4" />
                            <span className="sr-only">Imprimir</span>
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
