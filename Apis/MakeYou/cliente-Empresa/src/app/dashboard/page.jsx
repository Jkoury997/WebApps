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
    HammerIcon
  } from "lucide-react";

export default function Page() {
    const items = [
      { name: "Inicio", icon: HomeIcon, url: "/dashboard" },
      { name: "Mantenimiento", icon: HammerIcon, url: "/dashboard/mantenimiento" },
      { name: "Variables", icon: HammerIcon, url: "/dashboard/gerencia/tiendas/variables" },

    ];
  
    return <IconGrid items={items} />;
  }