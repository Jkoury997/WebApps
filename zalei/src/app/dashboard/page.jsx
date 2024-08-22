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
    EggIcon
  } from "lucide-react";

export default function Page() {
    const items = [
      { name: "Inicio", icon: HomeIcon, url: "/dashboard" },
      { name: "Cajones", icon: EggIcon, url: "/dashboard/stock/cajones/create" },
      { name: "Paquetes", icon: PackageIcon, url: "/dashboard/stock/pallets/move" },,
    ];
  
    return <IconGrid items={items} />;
  }