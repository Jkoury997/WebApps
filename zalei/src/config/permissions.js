// src/config/permissions.js

import { Package, Box } from 'lucide-react'; // Importa los iconos que deseas usar

const permissions = {
  Stock: {
    icon: Box, // Icono para el grupo Stock
    items: {
      Almacenes:{
        href:"/dashboard/stock/almacenes"
      },
      Cajones: {
        href: "/dashboard/stock/cajones",
      },
      Pallets: {
        href: "/dashboard/stock/pallets",
      },
      Paragua: {
        href: "/dashboard/stock/Paragua",
      },
    },
  },
  // Otros grupos pueden ser añadidos aquí con sus iconos
};

export default permissions;
