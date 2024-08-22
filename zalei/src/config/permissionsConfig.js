// config/permissionsConfig.js

const permissionsConfig = {
    Stock: {
      Almacenes2: {
        main: '/dashboard/stock/almacenes',
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
  