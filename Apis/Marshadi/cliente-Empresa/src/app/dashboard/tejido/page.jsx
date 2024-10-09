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
    PackageOpenIcon
  } from "lucide-react";

export default function Page() {
    const items = [
      { name: "Inicio", icon: HomeIcon, url: "/dashboard" },
      { name: "Informa tejido", icon: PackageOpenIcon, url: "/dashboard/tejido/informartejido" },
      { name: "Cambiar tejido", icon: PackageOpenIcon, url: "/dashboard/tejido/cambioarticulo" },

    ];
  
    return <IconGrid items={items} />;
  }