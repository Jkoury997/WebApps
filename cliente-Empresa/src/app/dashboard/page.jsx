"use client";
import IconGrid from "@/components/component/acces-fast";
import {
  HomeIcon,
  EggIcon,
  PackageIcon,
  WarehouseIcon,
} from "lucide-react";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Page() {
  const [showDialog, setShowDialog] = useState(false);

  // Check if the choice is already stored in localStorage
  useEffect(() => {
    const choice = localStorage.getItem("device");
    console.log("Device choice in localStorage:", choice); // Verifica el valor
    if (!choice) {
      setShowDialog(true);
    }
  }, []);

  const handleChoice = (choice) => {
    localStorage.setItem("device", choice);
    setShowDialog(false);
  };

  const items = [
    { name: "Inicio", icon: HomeIcon, url: "/dashboard" },
    { name: "Cajones", icon: EggIcon, url: "/dashboard/stock/cajones/create" },
    { name: "Paquetes", icon: PackageIcon, url: "/dashboard/stock/pallets/move" },
    { name: "Almacenes", icon: WarehouseIcon, url: "/dashboard/stock/warehouse" },
  ];

  return (
    <>
      {/* Show the dialog automatically if showDialog is true */}
      <AlertDialog open={showDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Seleccione un dispositivo</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Desea usar la cámara o el lector?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction  className="mb-2" onClick={() => handleChoice("camera")}>
              Usar Cámara
            </AlertDialogAction>
            <AlertDialogAction  className="mb-2"onClick={() => handleChoice("reader")}>
              Usar Lector
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Render the IconGrid */}
      <IconGrid items={items} />
    </>
  );
}
