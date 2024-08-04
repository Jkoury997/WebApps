// config/permissionsConfig.js

const permissionsConfig = {
    Stock: {
      Almacenes: {
        main: '/dashboard/stock/almacenes',
        View: '/almacenes/view',
      },
      Pallets: {
        main: '/dashboard/stock/pallets',
        Edit: '/pallets/edit',
        Insert: '/pallets/insert',
        View: '/pallets/view',
      },
    },
    Entidades: {
      Articulos: {
        main: '/articulos',
        View: '/articulos/view',
      },
      Cajones: {
        main: '/dashboard/stock/cajones',
        Insert: '/cajones/insert',
      },
      PARAGUA: {
        main: '/cajones',
        Insert: '/cajones/insert',
      },
    },
  };
  
  export default permissionsConfig;
  