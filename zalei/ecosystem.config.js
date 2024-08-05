module.exports = {
    apps: [
      {
        name: 'nextjs-app',       // Nombre de la aplicación en PM2
        script: 'node_modules/next/dist/bin/next',  // Ruta al ejecutable de Next.js
        args: 'start',            // Argumentos para iniciar Next.js
        instances: 'max',         // Número de instancias a ejecutar, 'max' usa todos los cores disponibles
        exec_mode: 'cluster',     // Modo de ejecución 'cluster' para balancear carga
      }
    ]
  };
  