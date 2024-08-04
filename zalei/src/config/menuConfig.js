// src/config/menuConfig.js

export const structurePermissions = (menu) => {
    // Aquí se estructura el menú de permisos en un formato específico
    return menu.map((item) => {
      return {
        Text: item.Text,
        Permisos: item.Permisos.map((permiso) => {
          return {
            Propiedad: permiso.Propiedad,
            Permiso: permiso.Permiso
          };
        })
      };
    });

  };
  