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
    LucideDrama,
    BellElectric,
    DraftingCompass,
    FactoryIcon,

  } from "lucide-react";

export default function Page() {
    const items = [
      { name: "Inicio", icon: HomeIcon, url: "/dashboard" },
      { name: "Tejido", icon: DraftingCompass, url: "/dashboard/tejido" },
      { name: "Produccion", icon: FactoryIcon, url: "/dashboard/produccion" },

    ];
      return <IconGrid items={items} />;
  }