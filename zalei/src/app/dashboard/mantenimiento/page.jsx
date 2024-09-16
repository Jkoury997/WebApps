"use client"
import IconGrid from "@/components/component/acces-fast";
import {
    HomeIcon,
    EggIcon,
    PackageIcon,
    MapPinHouse,
    PlusIcon,
    MapPinIcon,
    LucideMapPin,
} from "lucide-react";

export default function Page() {
    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";

    const items = [
      { name: "Lugares", icon: LucideMapPin, url: `${currentPath}/lugares` },
      { name: "Crear Tarea", icon: PlusIcon, url: `${currentPath}/tareas/crear` },
    ];

    return <IconGrid items={items} />;
}
