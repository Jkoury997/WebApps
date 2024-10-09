"use client"
import IconGrid from "@/components/component/acces-fast";
import {
    HomeIcon,
    SearchIcon,
    MailIcon,
    CalendarIcon,
    CameraIcon,
    Music2Icon,
    VideoIcon,
    SettingsIcon,
    PackageIcon,
    EggIcon,
    HammerIcon,
    MapPinIcon,
    FactoryIcon,
    ListChecks
  } from "lucide-react";

export default function Page() {
    const items = [
      { name: "Inicio", icon: HomeIcon, url: "/dashboard" },
      { name: "Empresa", icon: FactoryIcon, url: "/dashboard/mantenimiento/empresa" },
      { name: "Lugares", icon: MapPinIcon, url: "/dashboard/mantenimiento/lugar" },
      { name: "Tareas", icon: ListChecks, url: "/dashboard/mantenimiento/tareas" },
      { name: "Categorias", icon: ListChecks, url: "/dashboard/mantenimiento/categorias" },
    ];
  
    return <IconGrid items={items} />;
  }