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
    WarehouseIcon
  } from "lucide-react";

export default function Page() {
    const items = [
      { name: "Inicio", icon: HomeIcon, url: "/dashboard" },
      { name: "Cajones", icon: EggIcon, url: "/dashboard/stock/cajones/create" },
      { name: "Paquetes", icon: PackageIcon, url: "/dashboard/stock/pallets/move" },
      { name: "Almacenes", icon: WarehouseIcon, url: "/dashboard/stock/warehouse" },
    ];
  
    return <IconGrid items={items} />;
  }