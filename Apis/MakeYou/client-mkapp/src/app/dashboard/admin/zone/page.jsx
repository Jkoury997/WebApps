"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { QrCodeIcon, TrashIcon, EditIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import QRCode from 'react-qr-code';
import { useToast } from "@/hooks/use-toast"; // Importa el hook de toast

export default function Page() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openQR, setOpenQR] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [zoneToDelete, setZoneToDelete] = useState(null); // ID de la zona a eliminar
  const [currentQR, setCurrentQR] = useState('');
  const router = useRouter();
  const { toast } = useToast(); // Usa el hook de toast

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      const response = await fetch('/api/qrfichaqui/zones/list');
      if (!response.ok) {
        throw new Error('Error fetching zones');
      }
      const data = await response.json();
      setZones(Array.isArray(data) ? data : []);
      if (Array.isArray(data) && data.length === 0) {
        router.push('/dashboard/admin/zone/create');
      }
    } catch (error) {
      setError('Error fetching zones');
      console.error('Error fetching zones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/qrfichaqui/zones/delete?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchZones();
        toast({
          title: "Zona eliminada",
          description: "La zona se ha eliminado correctamente.",
          variant: "success",
        });
      } else {
        throw new Error('Error deleting zone');
      }
    } catch (error) {
      console.error('Error deleting zone:', error);
      setError('Error eliminando la zona');
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false); // Cierra el diálogo de confirmación
    }
  };

  const handleEdit = (id) => {
    // Implementar funcionalidad de edición
  };

  const handleQR = (id) => {
    setCurrentQR(id);
    setOpenQR(true);
  };

  const handleAdd = () => {
    router.push('/dashboard/admin/zone/create');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section className="w-full py-12">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Zonas</h2>
          <Button onClick={handleAdd}>Agregar Zona</Button>
        </div>

        {zones.length === 0 ? (
          <p>No hay zonas disponibles.</p>
        ) : (
          <div className="grid gap-4">
            {zones.map((zone) => (
              <div
                key={zone._id}
                className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between dark:bg-gray-800"
              >
                <div className="grid gap-1">
                  <h3 className="text-lg font-semibold">{zone.nombre}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{zone.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleQR(zone._id)} className="md:hidden">
                    <QrCodeIcon className="w-4 h-4" />
                    <span className="sr-only">Ver QR</span>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(zone._id)} className="md:hidden" disabled>
                    <EditIcon className="w-4 h-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setZoneToDelete(zone._id);
                      setOpenDeleteDialog(true);
                    }}
                    className="md:hidden"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Diálogo de QR */}
      <Dialog open={openQR} onOpenChange={setOpenQR}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Código QR</DialogTitle>
            <DialogDescription>
              Escanee este código QR para configurar la zona.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <QRCode value={currentQR} size={256} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenQR(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta zona? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={() => handleDelete(zoneToDelete)}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
