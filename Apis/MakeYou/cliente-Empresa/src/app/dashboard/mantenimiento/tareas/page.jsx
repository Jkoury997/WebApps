"use client"
import IconGrid from "@/components/component/acces-fast";
import {
    HomeIcon,
    ListIcon,
    PlusIcon,
    ListChecksIcon
  } from "lucide-react";

export default function Page() {
    const items = [
      { name: "Inicio", icon: HomeIcon, url: "/dashboard" },
      { name: "Crear", icon: PlusIcon, url: "/dashboard/mantenimiento/tareas/crear" },
      { name: "Pendientes", icon: ListIcon, url: "/dashboard/mantenimiento/tareas/pendientes" },
      { name: "Terminadas", icon: ListChecksIcon, url: "/dashboard/mantenimiento/tareas/terminadas" },

    ];
  
    return <IconGrid items={items} />;
  }