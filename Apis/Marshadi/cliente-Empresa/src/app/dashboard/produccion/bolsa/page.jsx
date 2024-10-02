"use client"
import IconGrid from "@/components/component/acces-fast";
import {
    HomeIcon,

    PlusIcon,
    Move
  } from "lucide-react";

export default function Page() {
    const items = [
      { name: "Inicio", icon: HomeIcon, url: "/dashboard" },
      { name: "Crear", icon:PlusIcon, url: "/dashboard/produccion/bolsa/crear" },
      { name: "Mover", icon: Move, url: "/dashboard/produccion/bolsa/mover" },

    ];
  
    return <IconGrid items={items} />;
  }