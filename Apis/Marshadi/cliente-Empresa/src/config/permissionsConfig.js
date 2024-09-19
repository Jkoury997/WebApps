// config/permissionsConfig.js
import { Box } from 'lucide-react';

const permissionsConfig = {
  Mantenimiento: {
    icon: Box, // Añadir el ícono aquí
    alwaysVisible: true, // Este grupo siempre debe estar visible
    Mantenimiento: {
      main: '/dashboard/mantenimiento',
      View: '/almacenes/view',
    },
  },
  Stock: {
    icon: Box, // Añadir el ícono aquí
    Almacenes: {
      main: '/dashboard/stock/warehouse',
      View: '/almacenes/view',
    },
    Cajones: {
      main: '/dashboard/stock/cajones/create',
      Insert: '/cajones/insert',
    },
    Pallets: {
      main: '/dashboard/stock/pallets/move',
      Edit: '/pallets/edit',
      Insert: '/pallets/insert',
      View: '/pallets/view',
    },
  },
};

export default permissionsConfig;
