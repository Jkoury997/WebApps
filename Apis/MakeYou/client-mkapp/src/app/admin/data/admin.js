import { TerminalSquare, Bot } from "lucide-react";

export const navAdmin = [
  {
    title: "Inicio",
    url: "/admin",
    icon: TerminalSquare,
    roles: ["admin"],
    items: [
      {
        title: "Métricas",
        url: "/admin/metrics",
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Clientes",
    url: "/admin/client/list",
    icon: Bot,
    roles: ["admin"],
  },
];
