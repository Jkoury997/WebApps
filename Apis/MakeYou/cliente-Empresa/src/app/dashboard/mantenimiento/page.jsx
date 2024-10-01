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
      { name: "Empresa", icon: HammerIcon, url: "/dashboard/mantenimiento/empresa" },
      { name: "Lugar", icon: HammerIcon, url: "/dashboard/mantenimiento/lugar" },

    ];
  
    return <IconGrid items={items} />;
  }